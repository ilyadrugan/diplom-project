import React, { useEffect, useState } from "react";
import TrackTable from "../components/Table/Table";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./styles/PageStyles.module.css";
import urls from "../utils/urls";
import userStore from "../stores/userStore/UserStore";
import requestStore from "../stores/requestStore/requestStore";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { Container, Row, Col, Card, Spinner, Alert, Form } from "react-bootstrap";
import { getRequestStatus } from "../utils/requestStatus";

import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const PhotoMap = ({ photos }) => {
  const defaultState = {
    center: [photos[0].coord_lat, photos[0].coord_long],
    zoom: 12,
  };

  return (
    <YMaps>
      <Map defaultState={defaultState} width="100%" height="400px">
        {photos.map((photo, index) => (
          <Placemark
            key={index}
            geometry={[photo.coord_lat, photo.coord_long]}
            properties={{
              balloonContent: `<strong>Адрес:</strong> ${photo.address}`,
            }}
          />
        ))}
      </Map>
    </YMaps>
  );
};
const RequestDetails = observer(() => {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (id) {
      fetchRequest(Number(id));
    }
  }, [id]);

  const fetchRequest = async (id: number) => {
    try {
      setIsLoading(true)
      await requestStore.getRequest(id);
      // setStatus(request.status)
    } catch (err) {
      setError("Ошибка при загрузке данных");
    }
    setIsLoading(false)
  };

  if (isLoading) {
    return (
      <div style={{paddingTop: 76}}>
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Загрузка...</p>
      </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{paddingTop: 76}}>
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
      </div>
    );
  }

  const request = requestStore.currentRequest;

  if (!request) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Фотоотчет не найдена</Alert>
      </Container>
    );
  }
 const handleChange = async (e) => {
      const newStatus = parseInt(e.target.value);
      await requestStore.changeRequestStatus({id: Number(id), status: newStatus})
      // Вызов функции, которая обновит статус на бэке
      // onStatusChange && onStatusChange(newStatus);
    };
    const user = userStore.users.find((user)=>user.login === request.user_login)
  return (
    <div style={{paddingTop: 76}}>
    <Container className="content-with-header" >
      <Card>
        <Card.Body>
          <Card.Title>Детали Фотоотчета №{request.id}</Card.Title>
          <Card.Text><strong>Пользователь:</strong> {request.user_login} - {user.last_name} {user.name} {user.middle_name}</Card.Text>
          <Card.Text><strong>Тип:</strong> {request.type?.type_name || request.type_id}</Card.Text>
          <Card.Text><strong>Комментарий:</strong> {request.comment || "—"}</Card.Text>
          <Card.Text>
            <strong>Создана:</strong> {new Date(request.time_create).toLocaleString()}
          </Card.Text>
          
           <div className="d-flex justify-content-between mt-3">
            <Card.Text>
            <strong>Статус:</strong> {getRequestStatus(request.status)}
          </Card.Text>
          {userStore.user.user_status === 'M' && <Form.Group controlId="statusSelect">
            <Form.Label>Изменить статус</Form.Label>
            <Form.Select  value={request.status} onChange={handleChange} style={{ width: '200px' }}>
              {[0,1,2].map(opt => (
                <option key={opt} value={opt}>{getRequestStatus(opt)}</option>
              ))}
            </Form.Select>
          </Form.Group>}
        </div>
        </Card.Body>
      </Card>

      <h4 className="mt-4">Фотографии</h4>
      {request.photos?.length ? (
        <Row className="mt-3">
          {request.photos.map((photo, index) => (
            <Col md={6} lg={4} className="mb-4" key={index}>
              <Card>
                <Card.Img
                  variant="top"
                  style={{maxHeight: 400, objectFit: 'contain'}}
                  
                  src={`${urls.url}${photo.photo_url}`}
                  alt={`Фото ${index + 1}`}
                />
                <Card.Body>
                  <Card.Text><strong>Адрес:</strong> {photo.address}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="mt-3">
          Нет фотографий
        </Alert>
      )}
      {request.photos.length> 0 &&
    <><h4 className="mt-4">Карта местоположений</h4>
     <PhotoMap photos={request.photos} />
    </>}
    </Container>
    
    </div>
  );
});

export default RequestDetails;