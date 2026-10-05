import jwt from "jsonwebtoken";

/**
 * 🔒 Express Middleware: authorization
 *
 * Middleware is just a function that runs in the middle, between Express receiving
 * an HTTP request and your final route controller sending a response.
 *
 * How it works:
 * 1. Checks for a JWT token inside HttpOnly cookies OR Authorization header.
 * 2. If missing -> immediately halts the request and returns 401 Unauthorized.
 * 3. If present -> verifies the cryptographic signature with JWT_SECRET.
 * 4. Attaches decoded token data ({ userId, role }) onto `req.user`.
 * 5. Calls `next()` to hand execution over to the next middleware or route handler.
 */
export const authentication = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    req.cookies?.token ||
    (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid or expired token" });
  }
};
