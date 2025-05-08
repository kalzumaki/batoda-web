import { NextApiRequest, NextApiResponse } from "next";
import FormData from "form-data";

// Disable the body parser to handle the raw form data manually
export const config = {
  api: {
    bodyParser: false, // Disables Next.js body parser to allow raw file uploads
  },
};

const API_BASE_URL = process.env.API_BASE_URL as string;
const appKey = process.env.APP_KEY;
const appSecret = process.env.APP_SECRET;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const endpoint = req.query.endpoint as string;
  const authToken = req.cookies.userToken || req.headers.authorization || "";

  if (!appKey || !appSecret) {
    return res.status(500).json({ error: "Missing App Key or App Secret" });
  }

  const targetUrl = `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  try {
    const formData = await parseFormData(req); // Parse the form data

    const headers: Record<string, string> = {
      "App-Key": appKey,
      "App-Secret": appSecret,
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
      ...formData.getHeaders(), // Form headers for file uploads
    };

    const fetchOptions: RequestInit = {
      method,
      headers,
      body: formData as unknown as BodyInit,
    };

    const response = await fetch(targetUrl, fetchOptions);
    const contentType = response.headers.get("content-type");
    const status = response.status;

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return res.status(status).json(data);
    } else {
      const text = await response.text();
      return res.status(status).send(text);
    }
  } catch (err: any) {
    console.error("Error handling FormData:", err);
    return res.status(500).json({ error: "Failed to handle FormData", details: err.message });
  }
}

// Helper function to parse the incoming raw request into FormData
async function parseFormData(req: NextApiRequest): Promise<FormData> {
  return new Promise<FormData>((resolve, reject) => {
    const form = new FormData();
    const chunks: Buffer[] = [];

    req.on("data", (chunk) => chunks.push(chunk)); // Accumulate chunks
    req.on("end", () => {
      const buffer = Buffer.concat(chunks);
      form.append("profile", buffer, { filename: "file.jpg" }); // Ensure the name is 'profile'
      resolve(form); // Resolve with FormData
    });
    req.on("error", (err) => reject(err)); // Reject on error
  });
}
