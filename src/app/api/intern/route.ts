import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows: string[][] = body.rows;

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
  } catch (error) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "100", 10);

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [data, total] = await Promise.all([
      prisma.intern.findMany({
        skip,
        take,
        orderBy: { id: "desc" },
      }),
      prisma.intern.count(),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูล intern ได้" },
      { status: 500 }
    );
  }
}
