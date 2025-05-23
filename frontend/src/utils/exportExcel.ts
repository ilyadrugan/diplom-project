import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getRequestStatus } from "./requestStatus";
import { RequestModel } from "../stores/requestStore/models";
import urls from "./urls";

export function exportTableToExcel(requests: RequestModel[]) {
  const rows = requests.map((request) => ({
    ID: request.id.toString(),
    Автор: request.user_login,
    Тип: request.type.type_name,
    Фото: request.photos.map(p => `${urls.url}${p.photo_url}`).join(', '),
    Комментарий: request.comment || '',
    Статус: getRequestStatus(request.status)
  }));

  // Создание worksheet
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Автоширина столбцов
  const objectMaxLength = [];
  const keys = Object.keys(rows[0]);

  keys.forEach((key, colIdx) => {
    let maxLength = key.length;
    rows.forEach(row => {
      const val = row[key];
      const len = val ? val.toString().length : 0;
      if (len > maxLength) maxLength = len;
    });
    objectMaxLength[colIdx] = { wch: maxLength + 2 }; // +2 на отступ
  });

  worksheet['!cols'] = objectMaxLength;

  // Создание и экспорт workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `requests_${new Date().toISOString().slice(0, 10)}.xlsx`);
}