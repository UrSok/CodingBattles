import { createProxyMiddleware } from 'http-proxy-middleware';

const context = ['/api'];

module.exports = app => {
  const appProxy = createProxyMiddleware(context, {
    target: process.env.REACT_APP_API_URL, //'https://localhost:7234',
    secure: false,
  });

  app.use(appProxy);
};
