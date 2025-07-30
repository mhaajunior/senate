"use client";

import { HotTable } from "@handsontable/react-wrapper";
import { registerAllModules } from "handsontable/registry";
import { useRef } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showWarning } from "@/lib/swal";
import { uploadInternData } from "@/lib/api";
import { Loader } from "./Loader";

import "handsontable/styles/handsontable.css";
import "handsontable/styles/ht-theme-main.css";

registerAllModules();

const ExcelSheet = () => {
  const queryClient = useQueryClient();
  const hotRef = useRef<any>(null);

  const mutation = useMutation({
    mutationKey: ["interns"],
    mutationFn: uploadInternData,
    onSuccess: (data) => {
      toast.success(`บันทึกข้อมูลสำเร็จ ${data.results.count} แถว`);
      queryClient.invalidateQueries({
        queryKey: ["internStatusCount"],
      });
    },
    onError: () => {
      toast.error("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    },
  });

  const handleSubmit = () => {
    const hot = hotRef.current?.hotInstance;
    if (!hot) return;

    const data = hot.getData();
    const filtered = data.filter((row: any) =>
      row.some((cell: any) => cell && cell !== "")
    );

    if (filtered.length === 0) {
      showWarning("กรุณากรอกข้อมูลในตารางก่อนทำการบันทึก");
      return;
    }

    mutation.mutate(filtered);
  };

  const handleAfterPaste = (data: any[][], coords: any[]) => {
    const hotInstance = hotRef.current?.hotInstance;
    if (!hotInstance) return;

    const tableData = hotInstance.getData();
    const lastRowIsEmpty = tableData[tableData.length - 1].every(
      (cell: any) =>
        cell === "" ||
        cell === null ||
        cell === undefined ||
        (typeof cell === "string" && cell.trim() === "")
    );

    if (!lastRowIsEmpty) {
      hotInstance.alter("insert_row_below", tableData.length - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {mutation.isPending && <Loader variant="full" size="lg" />}
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
        afterPaste={handleAfterPaste}
        licenseKey="non-commercial-and-evaluation"
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>นำเข้าข้อมูล</Button>
      </div>
    </div>
  );
};

export default ExcelSheet;
