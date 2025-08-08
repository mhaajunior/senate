import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/withAuth";

async function handler(req: NextRequest) {
  try {
    const status = await prisma.status.findMany({
      orderBy: { id: "asc" },
    });

    const requestStatus = status.filter((s) => s.type === 1 || s.type === 3);
    const verifyStatus = status.filter((s) => s.type === 2 || s.type === 3);

    return NextResponse.json({
      success: true,
      results: { status, requestStatus, verifyStatus },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}

export const groupVerifyStatus = async () => {
  const status = await prisma.status.findMany({
    orderBy: { id: "asc" },
  });

  const verifyStatus = status.filter((s) => s.type === 2 || s.type === 3);
  const verifyStatusGroup: Record<number, number[]> = {};
  for (const s of verifyStatus) {
    if (s.parentId) {
      if (!verifyStatusGroup[s.parentId]) {
        verifyStatusGroup[s.parentId] = [];
      }
      verifyStatusGroup[s.parentId].push(s.id);
    }
  }

  return { verifyStatusGroup, status };
};

export const GET = withAuth({ GET: handler });
