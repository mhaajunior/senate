import Swal from "sweetalert2";

/**
 * แสดง alert แบบ error
 */
export const showError = (message: string, title = "เกิดข้อผิดพลาด") => {
  return Swal.fire({
    icon: "error",
    title,
    text: message,
  });
};

/**
 * แสดง alert แบบ warning
 */
export const showWarning = (message: string, title = "คำเตือน") => {
  return Swal.fire({
    icon: "warning",
    title,
    text: message,
  });
};

/**
 * แสดง alert แบบ success
 */
export const showSuccess = (message: string, title = "สำเร็จ") => {
  return Swal.fire({
    icon: "success",
    title,
    text: message,
  });
};

/**
 * แสดง alert แบบ info
 */
export const showInfo = (message: string, title = "ข้อมูล") => {
  return Swal.fire({
    icon: "info",
    title,
    text: message,
  });
};
