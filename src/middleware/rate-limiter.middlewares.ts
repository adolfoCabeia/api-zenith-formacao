import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 5,
  message: {
    message: "Muitas tentativas. Tente novamente mais tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) =>
		res.status(options.statusCode).send(options.message),
});