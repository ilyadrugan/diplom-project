import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getRequestStatus } from "./requestStatus";
import { RequestModel } from "../stores/requestStore/models";
import urls from "./urls";
import { UserInfoModel } from "../stores/userStore/models";

export function exportTableToExcel(requests: RequestModel[], users: UserInfoModel[]) {
  
  let html = `<table border="1" cellspacing="0" cellpadding="4">
    <thead>
      <tr>
        <th>ID</th>
        <th>Автор</th>
        <th>Тип</th>
        <th>Фото</th>
        <th>Комментарий</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>`;

  requests.forEach((request) => {
    const user = users.find((user)=>user.login === request.user_login)
    const idLink = `<a href="${urls.localurl}/request/${request.id}" style="color:blue;text-decoration:underline;">${request.id}</a>`;
    const authorLink = `<a href="${urls.localurl}/user/${user.id}" style="color:blue;text-decoration:underline;">${user.last_name} ${user.name[0]}. ${user.middle_name[0]}.</a>`;
    const photos = request.photos.map(p => `<a href="${urls.url}${p.photo_url}">${p.photo_url}</a>`).join(', ');

    html += `
      <tr>
        <td>${idLink}</td>
        <td>${authorLink}</td>
        <td>${request.type.type_name}</td>
        <td>${photos}</td>
        <td>${request.comment || ''}</td>
        <td>${getRequestStatus(request.status)}</td>
      </tr>`;
  });

  html += `</tbody></table>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const fileName = `requests_${new Date().toISOString().slice(0, 10)}.xls`;
  saveAs(blob, fileName);
  // const header = ["ID", "Автор", "Тип", "Фото", "Комментарий", "Статус"];
  // const data = [header];
  // const hyperlinkStyle = {
  //   font: {
  //     color: 'blue',
  //     underline: true
  //   }
  // };
  // requests.forEach((request) => {
  //   const photos = request.photos.map(p => `${urls.url}${p.photo_url}`).join(', ');
  //   const user = users.find((user)=>user.login === request.user_login)
  //   // Гиперссылка на фотоотчет
  //   const reportUrl = `${urls.localurl}/request/${request.id}`;
  //   const idCell = {
  //     t: "s",
  //     v: request.id.toString(),
  //     l: { Target: reportUrl },
  //     s: hyperlinkStyle
  //   };


  //   // Гиперссылка на пользователя
  //   const userUrl = `${urls.localurl}/user/${user.id}`; // Или другой путь
  //   const authorCell = {
  //     t: "s",
  //     v: `${user.last_name} ${user.name[0]}. ${user.middle_name[0]}.`,
  //     l: { Target: userUrl },
  //     s: hyperlinkStyle
  //   };

  //   data.push([
  //     idCell,
  //     authorCell,
  //     request.type.type_name,
  //     photos,
  //     request.comment || '',
  //     getRequestStatus(request.status)
  //   ]);
  // });

  // const worksheet = XLSX.utils.aoa_to_sheet(data);

  // // Автоширина столбцов
  // const objectMaxLength = header.map((_, colIdx) => {
  //   let max = header[colIdx].length;
  //   for (let i = 1; i < data.length; i++) {
  //     const cell = data[i][colIdx];
  //     const value = typeof cell === 'object' ? cell.v : cell;
  //     const len = value ? value.toString().length : 0;
  //     if (len > max) max = len;
  //   }
  //   return { wch: max + 2 };
  // });

  // worksheet["!cols"] = objectMaxLength;

  // const workbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(workbook, worksheet, "Requests");

  // const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  // const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  // saveAs(blob, `requests_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
