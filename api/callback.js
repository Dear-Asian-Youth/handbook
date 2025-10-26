import { AuthorizationCode } from 'simple-oauth2';

export default async (req, res) => {
  try {
    // Validate required environment variables
    if (!process.env.OAUTH_CLIENT_ID) {
      console.error('Missing required environment variable: OAUTH_CLIENT_ID');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'OAuth client ID not configured. Please contact the administrator.'
      });
    }

    if (!process.env.OAUTH_CLIENT_SECRET) {
      console.error('Missing required environment variable: OAUTH_CLIENT_SECRET');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'OAuth client secret not configured. Please contact the administrator.'
      });
    }

    const { code, state } = req.query;

    // Validate required parameters
    if (!code) {
      console.error('Missing authorization code in callback');
      return res.status(400).send('Missing authorization code');
    }

    if (!state) {
      console.error('Missing state parameter in callback');
      return res.status(400).send('Missing state parameter');
    }

    // Note: Proper state validation would require storing the state value from auth.js
    // and verifying it here. Since we're using serverless functions without shared state,
    // we rely on GitHub's OAuth security. For production, consider using a database
    // or signed tokens to validate state.
    console.log('OAuth callback received with state:', state);

    const oauth2 = new AuthorizationCode({
      client: {
        id: process.env.OAUTH_CLIENT_ID,
        secret: process.env.OAUTH_CLIENT_SECRET,
      },
      auth: {
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token',
        authorizePath: '/login/oauth/authorize',
      },
    });

    // Use BASE_URL env var if set (for custom domains), otherwise construct from request
    const baseUrl = process.env.BASE_URL || 
                    (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host'] 
                      ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
                      : 'http://localhost:3000');
    
    const tokenParams = {
      code,
      redirect_uri: `${baseUrl}/api/callback`,
    };

    const accessToken = await oauth2.getToken(tokenParams);
    const token = accessToken.token.access_token;

    if (!token) {
      console.error('No access token received from GitHub');
      throw new Error('Failed to obtain access token');
    }

    // Return the token in a format that Decap CMS expects
    const responseBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Complete</title>
      </head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              console.log("receiveMessage %o", e);
              window.opener.postMessage(
                'authorization:github:success:${JSON.stringify({ token, provider: 'github' })}',
                e.origin
              );
              window.removeEventListener("message", receiveMessage, false);
            }
            window.addEventListener("message", receiveMessage, false);
            console.log("Posting message to opener");
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `;

    res.status(200).send(responseBody);
  } catch (error) {
    console.error('Access Token Error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
};

