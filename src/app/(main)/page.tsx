"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import Title from "@/components/Title";
import Summary from "@/components/dashboard/Summary";
import InternOfficeGraph from "@/components/dashboard/InternOfficeGraph";
import UpcomingTable from "@/components/dashboard/UpcomingTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const lineChartData = {
  labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค."],
  datasets: [
    {
      label: "ผู้สมัครรายเดือน",
      data: [10, 20, 35, 25, 40, 45, 50],
      fill: false,
      borderColor: "#3b82f6",
      tension: 0.3,
    },
  ],
};

const upcoming = [
  { name: "สมชาย ก.", status: "ส่งรายงาน", dueDate: "10 ส.ค. 67" },
  { name: "วิภา ข.", status: "สิ้นสุดฝึกงาน", dueDate: "12 ส.ค. 67" },
  { name: "จิรศักดิ์ ค.", status: "เริ่มฝึกงาน", dueDate: "15 ส.ค. 67" },
];

export default function Dashboard() {
  return (
    <>
      <Title>หน้าหลัก</Title>
      <Summary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>กราฟผู้สมัครรายเดือน</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={lineChartData} />
          </CardContent>
        </Card>

        <InternOfficeGraph />
      </div>

      <UpcomingTable />
    </>
  );
}
