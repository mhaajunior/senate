import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const groupedCount = await prisma.intern.groupBy({
      by: ["statusId"],
      _count: { _all: true },
    });

    const internCounts = groupedCount.reduce((acc, curr) => {
      acc[curr.statusId] = curr._count._all;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      results: { internCounts },
    });
  } catch (error) {}
}
