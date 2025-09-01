// Configuration variables
const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRATION_TIME || '1d'
  }
};

export default config;
