import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getRequestStatus } from "./requestStatus";
import { RequestModel } from "../stores/requestStore/models";

export function exportTableToExcel(requests: RequestModel[]) {
  // Формируем массив строк для Excel
  const rows = requests.map((request) => ({
    ID: request.id,
    Идентификатор: request.user_login,
    Тип: request.type.type_name,
    Фото: request.photos.map(p => p.photo_url).join(', '), // если несколько — через запятую
    Комментарий: request.comment || '',
    Статус: getRequestStatus(request.status)
  }));

  // Создание worksheet и workbook
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

  // Сохраняем
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `requests_${new Date().toISOString().slice(0, 10)}.xlsx`);
}