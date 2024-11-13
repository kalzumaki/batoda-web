import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = process.env.API_ENDPOINT as string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body, headers } = req;
  const endpoint = req.query.endpoint as string;

  const appKey = process.env.APP_KEY;
  const appSecret = process.env.APP_SECRET;


  if (!appKey || !appSecret) {
    console.error('Missing App Key or App Secret');
    return res.status(500).json({ error: 'Missing App Key or App Secret' });
  }

  const apiUrl = new URL(`${API_BASE_URL}${endpoint}`);

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        'App-Key': appKey,
        'App-Secret': appSecret,
        'Content-Type': 'application/json',
        Authorization: headers.authorization || '',
      },
      ...(method !== 'GET' && { body: JSON.stringify(body) }),
    };

    console.log('API URL:', apiUrl.toString());
    console.log('Fetch options:', fetchOptions);

    const response = await fetch(apiUrl.toString(), fetchOptions);
    const responseData = await response.json();

    if (!response.ok) {
      console.error('Error from external API:', responseData);
      return res.status(response.status).json({
        error: responseData.error || 'Failed to fetch from external API',
      });
    }
    const userTypeId = responseData.user.user_type_id;
    if (userTypeId >= 6 && userTypeId <= 8) {
      return res.status(401).json({ success: false, message: 'User not authorized.' });
    }

    return res.status(200).json(responseData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error during API request:', errorMessage);
    return res.status(500).json({ error: 'API request failed', details: errorMessage });
  }
}
