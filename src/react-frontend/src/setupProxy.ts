import { createProxyMiddleware } from 'http-proxy-middleware';

const context = ['/api'];

module.exports = app => {
  const appProxy = createProxyMiddleware(context, {
    target: 'https://localhost:7234',
    secure: false,
  });
  
  app.use(appProxy);
};
