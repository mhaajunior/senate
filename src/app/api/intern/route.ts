import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parse } from "date-fns";
import { InternValidation, InternValidationType } from "@/lib/validation";

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
              status: 1,
            },
          })
      )
    );

    return NextResponse.json({
      success: true,
      results: { count: interns.length },
    });
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
    const status = Number(searchParams.get("status"));

    const skip = (page - 1) * pageSize;
    const take = pageSize;

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
    if (internStatus === 2) {
      if (office) {
        where.office = { contains: office };
      }
      if (group) {
        where.group = { contains: group };
      }
    }

    const whereWithStatus = { ...where, status };

    if (internStatus === 1) {
      const [data, total, groupedCount] = await Promise.all([
        prisma.intern.findMany({
          skip,
          take,
          where: whereWithStatus,
          orderBy: { sendDate: "asc" },
        }),
        prisma.intern.count({ where: whereWithStatus }),
        prisma.intern.groupBy({
          by: ["status"],
          where,
          _count: { _all: true },
        }),
      ]);

      const statusCounts = groupedCount.reduce((acc, curr) => {
        acc[curr.status] = curr._count._all;
        return acc;
      }, {} as Record<string, number>);

      return NextResponse.json({
        success: true,
        results: { data, total, statusCounts },
      });
    } else {
      // TODO: หาจากตารางที่ verify แล้ว
      return NextResponse.json({
        success: true,
        results: {
          data: [],
          total: 0,
          statusCounts: {},
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const intern: InternValidationType = body.intern;
    const data = {
      ...intern,
      startDate: new Date(intern.startDate),
      endDate: new Date(intern.endDate),
    };

    const valid = InternValidation.safeParse(data);

    if (!valid.success) {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }

    const updatedIntern = await prisma.intern.update({
      where: { id: intern.id },
      data,
    });

    return NextResponse.json({
      success: true,
      results: {
        intern: updatedIntern,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "ไม่สามารถแก้ไขข้อมูลเด็กฝึกงานได้" },
      { status: 500 }
    );
  }
}
