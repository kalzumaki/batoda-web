import { NextApiRequest, NextApiResponse } from "next";

const API_BASE_URL = process.env.API_ENDPOINT as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body, headers } = req;
  const endpoint = req.query.endpoint as string;

  const appKey = process.env.APP_KEY;
  const appSecret = process.env.APP_SECRET;
  const authToken = req.cookies.userToken || headers.authorization || "";

  if (!appKey || !appSecret) {
    console.error("Missing App Key or App Secret");
    return res.status(500).json({ error: "Missing App Key or App Secret" });
  }

  const apiUrl = new URL(`${API_BASE_URL}${endpoint}`);

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "App-Key": appKey,
        "App-Secret": appSecret,
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(method !== "GET" && { body: JSON.stringify(body) }),
    };

    console.log("API URL:", apiUrl.toString());
    // console.log('Fetch options:', fetchOptions);  // console for the apikey and others

    const response = await fetch(apiUrl.toString(), fetchOptions);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error from external API:", responseData);
        return res.status(response.status).json({
          error: responseData.error || "Failed to fetch from external API",
        });
      }

      // for logout clear the cookies
      if (endpoint === "/logout") {
        res.setHeader(
          "Set-Cookie",
          "userToken=; Path=/; HttpOnly; Secure; Max-Age=0; SameSite=Strict"
        );
      }

      return res.status(200).json(responseData);
    } else {
      const errorText = await response.text();
      console.error("Non-JSON response from API:", errorText);
      return res
        .status(response.status)
        .json({ error: "Unexpected response format", details: errorText });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error during API request:", errorMessage);
    return res
      .status(500)
      .json({ error: "API request failed", details: errorMessage });
  }
}
