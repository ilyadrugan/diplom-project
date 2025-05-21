import styles from "./Table.module.css";
import React, {useState, useMemo, FC} from "react";
import { Table } from "react-bootstrap";
import urls from "../../utils/urls";
import {exportTableToExcel} from "../../utils/exportExcel";
import { getRequestStatus, getRequestStatusBadgeColor } from "../../utils/requestStatus";
import { RequestModel } from "../../stores/requestStore/models";

const PhotoLink = ({ photo_url, index, address, time }) => {
  return (
    <div>
      <a
        href={`${urls.url+ photo_url}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Фото {index + 1}
      </a>
      : {address}
    </div>
  );
};

const TableRow = ({ photos, request, type }) => {
  
  return (
    <tr>
      <td>
        <a
        href={`/request/${request.id}`}
        rel="noopener noreferrer"
      >{request.id}</a>
        
        {/* , {new Date(request.time_create).toLocaleTimeString()} */}
      </td>
      <td>{request.user_login}</td>
      <td>{type}</td>
      <td style={{ display: "flex", flexDirection: "column" }}>
        {photos.map((photo, i) => (
          <PhotoLink
            key={photo.photo_url}
            photo_url={photo.photo_url}
            address={photo.address}
            time={request.time_create}
            index={i}
          />
        ))}
      </td>
      <td>{request.comment}</td>
      <td>
        <div style={{textAlign: 'center',padding: 4, borderRadius: 8,backgroundColor: getRequestStatusBadgeColor(request.status) }}>
          {getRequestStatus(request.status)}
        </div>
      </td>
    </tr>
  );
};

const TrackTable = ({requests, date}) => {
 // eslint-disable-next-line react-hooks/rules-of-hooks
 const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  console.log('reqs', requests)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sortedRequests = useMemo(() => {
    let sortable = [...requests];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [requests, sortConfig]);

  const handleSort = (key) => {
      setSortConfig((prev) => {
        const direction =
          prev.key === key && prev.direction === "asc" ? "desc" : "asc";
        return { key, direction };
      });
    };

  return (
    <div className={styles.table}>
      <h4>{date.toLocaleDateString()}</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")} style={{ cursor: "pointer" }}>
              ID
            </th>
            <th
              onClick={() => handleSort("user_login")}
              style={{ cursor: "pointer" }}
            >
              Идентификатор
            </th>
            <th
              onClick={() => handleSort("type_id")}
              style={{ cursor: "pointer" }}
            >
              Тип
            </th>
            <th>Фото</th>
            <th
              onClick={() => handleSort("comment")}
              style={{ cursor: "pointer" }}
            >
              Комментарий
            </th>
            <th
              onClick={() => handleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Статус
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRequests.map((req) => {
            
            return (
              <TableRow
                key={req.id}
                photos={req.photos}
                request={req}
                type={req.type.type_name}
              ></TableRow>
            );
          })}
        </tbody>
      </Table>
      <button onClick={() => exportTableToExcel(requests)}>Экспорт в Excel</button>
    </div>
  );
};

export default TrackTable;
