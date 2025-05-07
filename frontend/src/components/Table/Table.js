import styles from "./Table.module.css";
import React from "react";
import { Table } from "react-bootstrap";
import urls from "../../utils/urls";

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
        {request.id}
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
    </tr>
  );
};

const TrackTable = (props) => {
  const requests = props.requests;
  const photos = props.photos;
  const types = props.types;


  return (
    <div className={styles.table}>
      <h4>{props.date.toLocaleDateString()}</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Идентификатор</th>
            <th>Тип</th>
            <th>Фото</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => {
            console.log('req', req)
            const photoToRender = photos.filter(
              (photo) => photo.request_id == req.id
            );
            console.log('photoToRender', photoToRender)

            const type = types.find(
              (type) => type.id == req.type_id
            );
            return (
              <TableRow
                key={req.type_id + req.user_login}
                photos={photoToRender}
                request={req}
                type={type?type.type_name:null}
              ></TableRow>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default TrackTable;
