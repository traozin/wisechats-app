import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware triggered for:", request.url);
  const token = request.cookies.get("jwt-wisecharts")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url), {
      headers: {
        "Set-Cookie": `redirectTo=${request.url};`,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!register$|$|_next|favicon.ico|assets|images|fonts).*)"],
};