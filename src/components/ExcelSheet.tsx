"use client";

import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";
import { useRef } from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { showError, showWarning } from "@/lib/swal";

registerAllModules();

const ExcelSheet = () => {
  const hotRef = useRef<any>(null);

  const mutation = useMutation({
    mutationFn: async (rows: string[][]) => {
      const res = await axios.post("/api/save", { rows });
      return res.data;
    },
    onSuccess: (data) => {
      alert(`✅ บันทึกข้อมูลสำเร็จ ${data.count} แถว`);
    },
    onError: () => {
      showError("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    },
  });

  const handleSubmit = () => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const data = hot.getData();
    const filtered = data.filter((row: any) =>
      row.some((cell: any) => cell && cell !== "" && cell !== null)
    );
    console.log("ข้อมูลทั้งหมดจากตาราง:", filtered);
    if (filtered.length === 0) {
      showWarning("กรุณากรอกข้อมูลในตารางก่อนทำการบันทึก");
      return;
    }

    // mutation.mutate(filtered);
  };

  return (
    <div className="flex flex-col gap-4">
      <HotTable
        ref={hotRef}
        themeName="ht-theme-main"
        data={[
          ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
          ["", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ]}
        rowHeaders={true}
        colHeaders={[
          "ประทับเวลา",
          "หมายเลขประจำตัวประชาชน",
          "คำนำหน้า",
          "ชื่อ",
          "นามสกุล",
          "สถานศึกษา",
          "คณะ",
          "สาขา",
          "หมายเลขโทรศัพท์",
          "อีเมล",
          "วันที่เริ่มฝึกงาน",
          "วันที่สิ้นสุดฝึกงาน",
          "สำนัก/กลุ่มงาน/ลักษณะงาน ที่สนใจฝึกงาน",
          "แบบลงทะเบียนขอฝึกงาน",
        ]}
        height="auto"
        width="100%"
        stretchH="all"
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>นำเข้าข้อมูล</Button>
      </div>
    </div>
  );
};

export default ExcelSheet;
