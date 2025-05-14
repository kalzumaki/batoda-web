import { NextApiRequest, NextApiResponse } from "next";
import { ENDPOINTS } from "./endpoints";

const API_BASE_URL = process.env.API_BASE_URL as string;

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

  const apiUrl = new URL(
    `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`
  );

  try {
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "App-Key": appKey,
        "App-Secret": appSecret,
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      ...(method !== "GET" && { body: JSON.stringify(body) }),
    };

    console.log("API URL:", apiUrl.toString());

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

      if (endpoint === ENDPOINTS.LOGOUT) {
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
