import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { groupVerifyStatus } from "../status/route";

async function handler(req: NextRequest) {
  try {
    // จัดกลุ่ม verify status
    const verifyStatusGroup = await groupVerifyStatus();

    const groupedCount = await prisma.intern.groupBy({
      by: ["statusId"],
      _count: { _all: true },
    });

    const countMap = new Map<number, number>();
    groupedCount.forEach((item) => {
      countMap.set(item.statusId, item._count._all);
    });

    const internCounts: Record<string, number> = {};

    // รวมกลุ่มจาก groupVerifyStatus
    for (const [groupId, relatedIds] of Object.entries(verifyStatusGroup)) {
      const allIds = [Number(groupId), ...relatedIds];
      internCounts[groupId] = allIds.reduce(
        (sum, id) => sum + (countMap.get(id) || 0),
        0
      );
    }

    // ใส่ status อื่นๆ ที่ไม่ได้อยู่ในกลุ่ม
    groupedCount.forEach((item) => {
      const idStr = String(item.statusId);
      if (!(idStr in internCounts)) {
        internCounts[idStr] = item._count._all;
      }
    });

    return NextResponse.json({
      success: true,
      results: { internCounts },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ไม่สามารถแก้ไขข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}

export const GET = withAuth({ GET: handler });
