// lib/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export function verifyToken(token) {
  try {
    // console.log("JWT_SECRET in verifyToken:", JWT_SECRET);
    // console.log("token in verifyToken:", token);

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('JWT token verification failed:', error);
    return null;
  }
}
