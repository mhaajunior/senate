import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type Handler = (req: NextRequest) => Promise<Response>;

interface AuthHandlers {
  GET?: Handler;
  POST?: Handler;
  PUT?: Handler;
  PATCH?: Handler;
  DELETE?: Handler;
}

export function withAuth(handlers: AuthHandlers) {
  return async function (req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const method = req.method?.toUpperCase() || "";

    const handler = handlers[method as keyof AuthHandlers];

    if (!handler) {
      return NextResponse.json(
        { error: `Method ${method} Not Allowed` },
        { status: 405 }
      );
    }

    return handler(req);
  };
}
