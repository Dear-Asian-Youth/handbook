const { AuthorizationCode } = require('simple-oauth2');
const randomstring = require('randomstring');

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

  res.status(200).json({
    url: authorizationUri,
    state: state,
  });
};

