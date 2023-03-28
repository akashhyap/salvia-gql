// pages/api/secure-data.js
import { verifyToken } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userData = verifyToken(token);

    if (!userData) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Do something with the user data
    // userData.userId and userData.userEmail are available

    res.status(200).json({ data: 'Secure data' });
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
