"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Pointer,
  UserRound,
  UserRoundCheck,
  UserRoundCog,
  UserRoundX,
  UsersRound,
} from "lucide-react";
import { useInternStatusCount } from "@/hooks/useInternStatusCount";
import { useDataStore } from "@/store/useDataStore";
import { STATUS_CATEGORY } from "@/lib/options";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { Pie } from "react-chartjs-2";

const nameMap: Record<string, string> = {
  TOTAL: "ผู้สมัครทั้งหมด",
  PENDING: "รอดำเนินการ",
  VERIFY: "ตอบรับแล้ว",
  CANCEL: "ยกเลิก/ปฏิเสธ",
  OTHER: "อื่นๆ",
};

const summary = [
  {
    id: "TOTAL",
    title: nameMap["TOTAL"],
    icon: <UsersRound />,
    color: "bg-blue-500/50",
  },
  {
    id: "VERIFY",
    title: nameMap["VERIFY"],
    icon: <UserRoundCheck />,
    color: "bg-green-500/50",
  },
  {
    id: "PENDING",
    title: nameMap["PENDING"],
    icon: <UserRoundCog />,
    color: "bg-yellow-500/50",
  },
  {
    id: "CANCEL",
    title: nameMap["CANCEL"],
    icon: <UserRoundX />,
    color: "bg-red-500/50",
  },
  {
    id: "OTHER",
    title: nameMap["OTHER"],
    icon: <UserRound />,
    color: "bg-purple-500/50",
  },
];

const Summary = () => {
  const { isLoading, isFetching } = useInternStatusCount();
  const { overallStatusCount } = useDataStore();

  const [categoryCount, setCategoryCount] = useState<Record<string, number>>({
    TOTAL: 0,
    PENDING: 0,
    VERIFY: 0,
    CANCEL: 0,
    OTHER: 0,
  });
  const [statusCount, setStatusCount] = useState<
    Record<string, { name: string; count: number }[]>
  >({});
  const [pieChartData, setPieChartData] = useState<any>(null);

  useEffect(() => {
    const tempCatCount: Record<string, number> = {
      TOTAL: 0,
      PENDING: 0,
      VERIFY: 0,
      CANCEL: 0,
      OTHER: 0,
    };
    const tempStatusCount: Record<string, { name: string; count: number }[]> =
      {};

    const { PENDING, VERIFY, CANCEL, OTHER } = STATUS_CATEGORY;
    const categoryMap: Record<string, number[]> = {
      PENDING,
      VERIFY,
      CANCEL,
      OTHER,
    };

    for (const [key, value] of Object.entries(overallStatusCount)) {
      const status = Number(key);
      tempCatCount.TOTAL += value.count;

      for (const category in categoryMap) {
        if (categoryMap[category].includes(status)) {
          tempCatCount[category] = (tempCatCount[category] || 0) + value.count;
          if (!tempStatusCount[category]) {
            tempStatusCount[category] = [];
          }
          tempStatusCount[category].push({
            name: value.name,
            count: value.count,
          });
          break;
        }
      }
    }

    setCategoryCount(tempCatCount);
    setStatusCount(tempStatusCount);
  }, [overallStatusCount]);

  useEffect(() => {
    const pieChartData = {
      labels: summary
        .filter((item) => item.id !== "TOTAL" && categoryCount[item.id] > 0)
        .map((item) => item.title),
      datasets: [
        {
          label: "จำนวน",
          data: summary
            .filter((item) => item.id !== "TOTAL" && categoryCount[item.id] > 0)
            .map((item) => categoryCount[item.id]),
          backgroundColor: summary
            .filter((item) => item.id !== "TOTAL" && categoryCount[item.id] > 0)
            .map((item) => {
              const colorMap: Record<string, string> = {
                "bg-green-500/50": "#10b981",
                "bg-yellow-500/50": "#facc15",
                "bg-red-500/50": "#ef4444",
                "bg-purple-500/50": "#a855f7",
                "bg-blue-500/50": "#3b82f6",
              };
              return colorMap[item.color] ?? "#d1d5db";
            }),
        },
      ],
    };
    setPieChartData(pieChartData);
  }, [categoryCount]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {summary.map((item, index) => {
          const hasStatus = statusCount[item.id]?.length > 0;

          const cardContent = (
            <Card key={index} className={cn("h-[160px]", item.color)}>
              <CardHeader>
                <CardTitle className="text-base flex gap-3">
                  {item.icon}
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading || isFetching ? (
                  <Skeleton className={cn("h-8 w-full", item.color)} />
                ) : (
                  <>
                    <p className="text-2xl font-bold">
                      {categoryCount[item.id]}
                    </p>
                    {hasStatus && (
                      <div className="relative">
                        <Pointer className="absolute bottom-0 right-0 opacity-20 z-1" />
                        <div className="absolute bottom-5 right-2 w-4 h-4">
                          <span
                            className={cn(
                              "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                              item.color
                            )}
                          ></span>
                          <span
                            className={cn(
                              "relative inline-flex rounded-full h-4 w-4",
                              item.color
                            )}
                          ></span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );

          return hasStatus ? (
            <Tooltip key={index}>
              <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
              <TooltipContent className="flex flex-col gap-2 w-56 p-3">
                <h1 className="text-lg font-bold">{item.title}</h1>
                {statusCount[item.id].map((s, idx) => (
                  <div key={idx} className="flex w-full">
                    <span className="w-[85%] truncate">{s.name}</span>
                    <span className="w-[15%] text-right">{s.count}</span>
                  </div>
                ))}
              </TooltipContent>
            </Tooltip>
          ) : (
            <div key={index}>{cardContent}</div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>สัดส่วนสถานะเด็กฝึกงาน</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || isFetching || !pieChartData ? (
              <div className="flex flex-col gap-2">
                <Skeleton className={cn("h-4 w-full")} />
                <Skeleton className={cn("h-36 w-full")} />
              </div>
            ) : (
              <Pie data={pieChartData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Summary;
