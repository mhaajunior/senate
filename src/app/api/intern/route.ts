import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "date-fns";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows: string[][] = body.rows;

  console.log("rows ", rows);

  if (!rows || !Array.isArray(rows)) {
    return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }

  const interns = await Promise.all(
    rows.map(
      ([
        sendDate,
        iden,
        prefix,
        firstName,
        lastName,
        academy,
        faculty,
        branch,
        phone,
        email,
        startDate,
        endDate,
        preferredJob,
      ]) =>
        prisma.intern.create({
          data: {
            iden,
            prefix,
            firstName,
            lastName,
            academy,
            faculty,
            branch,
            phone,
            email,
            startDate: parse(startDate, "d/M/yyyy", new Date()),
            endDate: parse(endDate, "d/M/yyyy", new Date()),
            preferredJob,
            sendDate: parse(sendDate, "d/M/yyyy, HH:mm:ss", new Date()),
          },
        })
    )
  );

  return NextResponse.json({ success: true, count: interns.length });
}
