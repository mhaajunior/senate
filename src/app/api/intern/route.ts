import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "date-fns";
import {
  InternValidation,
  StatusValidation,
  OnVerifyInternValidation,
  VerifyInternValidationType,
  VerifyInternValidation,
} from "@/lib/validation";
import { withAuth } from "@/lib/withAuth";
import { getToken } from "next-auth/jwt";
import { groupVerifyStatus } from "../status/route";

async function postHandler(req: NextRequest) {
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
              statusId: 1,
            },
          })
      )
    );

    return NextResponse.json({
      success: true,
      results: { count: interns.length },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}

async function getHandler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "100");
    const internStatus = Number(searchParams.get("internStatus") ?? "1");
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const academy = searchParams.get("academy");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const office = searchParams.get("office");
    const group = searchParams.get("group");
    const statusId = Number(searchParams.get("statusId"));

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = { statusId };

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
    if (internStatus === 2) {
      if (office) {
        where.officeId = Number(office);
      }
      if (group) {
        where.groupId = Number(group);
      }

      // จัดกลุ่ม verify status
      const verifyStatusGroup = await groupVerifyStatus();

      if (verifyStatusGroup[statusId]) {
        const statusIdList = [statusId, ...verifyStatusGroup[statusId]];
        where.statusId = { in: statusIdList };
      }
    }

    const [data, total] = await Promise.all([
      prisma.intern.findMany({
        skip,
        take,
        where,
        orderBy: [{ sendDate: "asc" }, { updatedAt: "desc" }],
        include: {
          status: true,
          office: true,
          group: true,
          updatedBy: {
            select: {
              username: true,
            },
          },
        },
      }),
      prisma.intern.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      results: { data, total },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}

async function putHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const intern: VerifyInternValidationType = body.intern;
    const verifyStatusIds: number[] = body.verifyStatusIds;
    const data = {
      ...intern,
      startDate: new Date(intern.startDate),
      endDate: new Date(intern.endDate),
    };

    const verify = verifyStatusIds.includes(Number(intern.statusId));
    const valid = verify
      ? VerifyInternValidation.safeParse(data)
      : InternValidation.safeParse(data);

    const found = prisma.intern.findFirst({
      where: { id: intern.id },
    });

    if (!valid.success || !found) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const updatedIntern = await prisma.intern.update({
      where: { id: intern.id },
      data: {
        ...data,
        statusId: Number(intern.statusId),
        isEdited: true,
        updatedById: token?.sub,
        officeId: verify ? Number(data.officeId) : null,
        groupId: verify ? Number(data.groupId) : null,
        isVerify: verify,
      },
    });

    return NextResponse.json({
      success: true,
      results: {
        intern: updatedIntern,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ไม่สามารถแก้ไขข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}

async function patchHandler(req: NextRequest) {
  try {
    const body = await req.json();
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { id, statusId, verifyIntern, verifyStatusIds } = body;

    const validStatus = StatusValidation.safeParse({ statusId });

    const found = prisma.intern.findFirst({
      where: { id },
    });

    if (!validStatus.success || !found) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const verify = verifyStatusIds.includes(Number(statusId));

    if (statusId === "4" && !verifyIntern) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    if (verifyIntern) {
      const validVerifyIntern =
        OnVerifyInternValidation.safeParse(verifyIntern);
      if (!validVerifyIntern.success) {
        return NextResponse.json(
          { error: "ข้อมูลไม่ถูกต้อง" },
          { status: 400 }
        );
      }
    }

    let updatedData: any = {
      statusId: Number(statusId),
      isEdited: true,
      updatedById: token?.sub,
      isVerify: verify,
    };
    if (verify) {
      if (statusId === "4") {
        updatedData.officeId = Number(verifyIntern.officeId);
        updatedData.groupId = Number(verifyIntern.groupId);
      }
    } else {
      updatedData.officeId = null;
      updatedData.groupId = null;
    }

    const updatedIntern = await prisma.intern.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json({
      success: true,
      results: { intern: updatedIntern },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ไม่สามารถแก้ไขข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}

export const GET = withAuth({ GET: getHandler });
export const POST = withAuth({ POST: postHandler });
export const PUT = withAuth({ PUT: putHandler });
export const PATCH = withAuth({ PATCH: patchHandler });
