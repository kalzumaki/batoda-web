import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function to handle authentication and authorization
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("userToken");

  // Redirect to login if there's no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Validate the token by calling the Laravel API endpoint
    const response = await fetch(`${process.env.API_ENDPOINT}/validate-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Redirect to login if the token is invalid
    if (!response.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userData = await response.json();

    // Example of restricting routes based on user roles
    const restrictedRoutes: any = {
      1: ["/admin"],       // Only 'admin' users can access /admin
      2: ["/president"],    // Only 'president' users can access /president
      3: ["/secretary"],    // Only 'secretary' users can access /secretary
      4: ["/treasurer"],    // Only 'treasurer' users can access /treasurer
      5: ["/auditor"],      // Only 'auditor' users can access /auditor
    };

    const userTypeId = userData.user_type_id;
    const pathname = request.nextUrl.pathname;

    // Check if the user has permission to access the requested route
    if (restrictedRoutes[userTypeId] && !restrictedRoutes[userTypeId].includes(pathname)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Allow access if the token is valid and authorized for the route
    return NextResponse.next();
  } catch (error) {
    console.error("Error validating token:", error);
    // Redirect to login if there's an error in token validation
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Exclude `/login` and `/unauthorized` paths to avoid redirect loops
export const config = {
  matcher: ["/((?!login|unauthorized).*)"], // Apply middleware to all paths except /login and /unauthorized
};
