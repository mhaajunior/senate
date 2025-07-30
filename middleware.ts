import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // ถ้าเป็นหน้า /login หรือ หน้า public อื่น ๆ ให้ผ่าน
    if (pathname === "/login") {
      return NextResponse.next();
    }

    // เช็ค token (login หรือไม่)
    const token = req.nextauth.token;
    if (!token) {
      // ถ้าไม่มี token ให้ redirect ไป /login
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // ถ้า login แล้ว ให้ผ่านปกติ
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!login).*)"],
};
