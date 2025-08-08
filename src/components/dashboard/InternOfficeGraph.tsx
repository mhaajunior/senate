"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { fetchInternOffice, OfficeInfo } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

const options = {
  indexAxis: "y" as const,
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      grid: {
        drawOnChartArea: false,
        drawTicks: false,
      },
    },
  },
  datasets: {
    bar: {
      categoryPercentage: 0.6,
      barPercentage: 0.4,
    },
  },
};

const InternOfficeGraph = () => {
  const [officeData, setOfficeData] = useState<any>(null);

  const { isLoading, isFetching, data, isError } = useQuery({
    queryKey: ["internOffice"],
    queryFn: () => fetchInternOffice(),
  });

  useEffect(() => {
    if (data?.success) {
      const { internOffice } = data.results;
      if (internOffice && Object.keys(internOffice).length > 0) {
        const chartData = prepareChartData(internOffice);
        setOfficeData(chartData);
      } else {
        setOfficeData(null);
      }
    } else {
      setOfficeData(null);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error("โหลด InternOffice ไม่สำเร็จ");
    }
  }, [isError]);

  function prepareChartData(internOffice: Record<string, OfficeInfo[]>) {
    // 1. หา offices unique ทั้งหมดจากทุก status
    const officeMap = new Map<number, string>();

    Object.values(internOffice).forEach((arr) => {
      arr.forEach((item) => {
        if (item.officeId && item.office?.name) {
          officeMap.set(item.officeId, item.office.name);
        }
      });
    });

    const officeIds = Array.from(officeMap.keys());
    const labels = officeIds.map((id) => officeMap.get(id) || `Office ${id}`);

    // 2. เตรียม data สำหรับ statusId=13 ("กำลังฝึกงาน")
    const activeData = officeIds.map((officeId) => {
      const arr = internOffice["13"] || [];
      const found = arr.find((item) => item.officeId === officeId);
      return found ? found.count : 0;
    });

    // 3. เตรียม data สำหรับ statusId 6-12 ("รอฝึกงาน")
    const waitingData = officeIds.map((officeId) => {
      let total = 0;
      for (let sid = 6; sid <= 12; sid++) {
        const arr = internOffice[sid.toString()] || [];
        const found = arr.find((item) => item.officeId === officeId);
        if (found) {
          total += found.count;
        }
      }
      return total;
    });

    // 4. สร้าง data object สำหรับ Chart.js
    return {
      labels,
      datasets: [
        {
          label: "รอฝึกงาน",
          data: waitingData,
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: false,
          tension: 0.3,
        },
        {
          label: "กำลังฝึกงาน",
          data: activeData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: false,
          tension: 0.3,
        },
      ],
    };
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>จำนวนเด็กฝึกงานต่อหน่วยงาน</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        ) : officeData ? (
          <Bar data={officeData} options={options} />
        ) : (
          <div className="w-full text-center">ไม่มีเด็กฝึกงานในช่วงเวลานี้</div>
        )}
      </CardContent>
    </Card>
  );
};

export default InternOfficeGraph;
