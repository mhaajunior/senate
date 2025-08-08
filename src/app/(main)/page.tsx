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

const summary = [
  { title: "เด็กฝึกงานทั้งหมด", value: 120 },
  { title: "ยืนยันแล้ว", value: 85 },
  { title: "รอดำเนินการ", value: 25 },
  { title: "ยกเลิก/ปฏิเสธ", value: 10 },
];

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

const pieChartData = {
  labels: ["ยืนยันแล้ว", "รอดำเนินการ", "ยกเลิก/ปฏิเสธ"],
  datasets: [
    {
      label: "สถานะ",
      data: [85, 25, 10],
      backgroundColor: ["#10b981", "#facc15", "#ef4444"],
    },
  ],
};

const departmentBarData = {
  labels: ["กอง A", "กอง B", "กอง C"],
  datasets: [
    {
      label: "จำนวนเด็กฝึกงาน",
      data: [30, 45, 25],
      backgroundColor: "#6366f1",
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

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>กราฟผู้สมัครรายเดือน</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={lineChartData} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>สัดส่วนสถานะเด็กฝึกงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data={pieChartData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>จำนวนเด็กฝึกงานต่อหน่วยงาน</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={departmentBarData} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Table */}
      <Card>
        <CardHeader>
          <CardTitle>กิจกรรมใกล้ครบกำหนด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2">ชื่อ</th>
                  <th className="border-b p-2">สถานะ</th>
                  <th className="border-b p-2">วันที่ครบกำหนด</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2 border-b">{item.name}</td>
                    <td className="p-2 border-b">{item.status}</td>
                    <td className="p-2 border-b">{item.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
