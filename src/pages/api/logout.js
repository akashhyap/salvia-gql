// /pages/api/logout.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Set the 'auth-token' and 'userToken' cookies to an empty value and set them to expire immediately
    res.setHeader('Set-Cookie', [
      'auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
      // 'userToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
    ]);

    // Send success response
    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    // Return a 405 'Method Not Allowed' if the request method is not POST
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
