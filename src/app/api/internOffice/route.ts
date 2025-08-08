import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

async function handler(req: NextRequest) {
  try {
    const groupedInterns = await prisma.intern.groupBy({
      by: ["officeId", "statusId"],
      where: {
        statusId: {
          gte: 6,
          lte: 13,
        },
      },
      _count: {
        id: true,
      },
    });

    let dataByStatus: Record<
      number,
      Array<{ officeId: number | null; count: number; office: any | null }>
    > = {};

    if (groupedInterns.length > 0) {
      const officeIds = groupedInterns
        .map((item) => item.officeId)
        .filter(Boolean) as number[];

      const offices = await prisma.office.findMany({
        where: {
          id: { in: officeIds },
        },
      });

      groupedInterns.forEach((item) => {
        if (!dataByStatus[item.statusId]) {
          dataByStatus[item.statusId] = [];
        }
        dataByStatus[item.statusId].push({
          officeId: item.officeId,
          count: item._count.id,
          office: offices.find((o) => o.id === item.officeId) || null,
        });
      });
    }

    return NextResponse.json({
      success: true,
      results: { internOffice: dataByStatus },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}

export const GET = withAuth({ GET: handler });
