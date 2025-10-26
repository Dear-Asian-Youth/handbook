const { AuthorizationCode } = require('simple-oauth2');

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

module.exports = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.status(400).send('Missing authorization code');
    return;
  }

  try {
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
    console.error('Access Token Error', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

