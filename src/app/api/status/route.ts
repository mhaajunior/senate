import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const status = await prisma.status.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      success: true,
      results: { status },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}
