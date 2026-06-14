export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const appPassword = process.env.VITE_APP_PASSWORD || process.env.APP_PASSWORD || '';
  const isPasswordRequired = appPassword.length > 0;

  if (req.method === 'GET') {
    return res.status(200).json({ isPasswordRequired });
  }

  if (req.method === 'POST') {
    if (!isPasswordRequired) {
        return res.status(200).json({ success: true });
    }
    const { password } = req.body;
    const success = password === appPassword;
    return res.status(200).json({ success });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
