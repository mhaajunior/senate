import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { groupVerifyStatus } from "../status/route";

async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const internStatus = Number(searchParams.get("internStatus") ?? "1");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const academy = searchParams.get("academy");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const office = searchParams.get("office");
    const group = searchParams.get("group");

    const where: any = {};

    if (firstName) {
      where.firstName = { contains: firstName };
    }
    if (lastName) {
      where.lastName = { contains: lastName };
    }
    if (academy) {
      where.academy = { contains: academy };
    }
    if (startDate) {
      where.startDate = startDate;
    }
    if (endDate) {
      where.endDate = endDate;
    }
    if (office) {
      where.officeId = Number(office);
    }
    if (group) {
      where.groupId = Number(group);
    }
    if (internStatus === 2) {
      if (office) {
        where.officeId = Number(office);
      }
      if (group) {
        where.groupId = Number(group);
      }
    }

    // จัดกลุ่ม verify status
    const { verifyStatusGroup, status } = await groupVerifyStatus();

    const groupedCount = await prisma.intern.groupBy({
      by: ["statusId"],
      where,
      _count: { _all: true },
    });

    const countMap = new Map<number, number>();
    groupedCount.forEach((item) => {
      countMap.set(item.statusId, item._count._all);
    });

    const overallCounts: Record<string, { name: string; count: number }> = {};
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
      const found = status.find((s) => s.id === item.statusId);
      overallCounts[item.statusId] = {
        name: found!.name,
        count: item._count._all,
      };
    });

    return NextResponse.json({
      success: true,
      results: { internCounts, overallCounts },
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
