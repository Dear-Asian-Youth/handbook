import { AuthorizationCode } from 'simple-oauth2';
import randomstring from 'randomstring';

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

    const state = randomstring.generate(32);
    
    // Use BASE_URL env var if set (for custom domains), otherwise construct from request
    const baseUrl = process.env.BASE_URL || 
                    (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host'] 
                      ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
                      : 'http://localhost:3000');
    
    const authorizationUri = oauth2.authorizeURL({
      redirect_uri: `${baseUrl}/api/callback`,
      scope: 'repo,user',
      state: state,
    });

    // Redirect to GitHub OAuth authorization page
    res.redirect(authorizationUri);
  } catch (error) {
    console.error('Error in auth endpoint:', error);
    res.status(500).json({ 
      error: 'Authentication initialization failed',
      message: error.message 
    });
  }
};

