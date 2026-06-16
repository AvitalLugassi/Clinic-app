export const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} | IP: ${req.ip} | ${res.statusCode} | ${Date.now() - start}ms`);
  });
  next();
};
