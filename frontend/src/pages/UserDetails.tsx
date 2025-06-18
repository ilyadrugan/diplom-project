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
import { Container, Row, Col, Card, Spinner, Alert, Form, Button } from "react-bootstrap";
import { getRequestStatus } from "../utils/requestStatus";
import { getUserStatusName } from "../utils/userStatus";
import { ChangeUserModel, UserInfoModel } from "../stores/userStore/models";


const UserDetails = observer(() => {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfoModel>({
    login: '',
    email: '',
    user_status: 'W',
    name: '',
    last_name: '',
    middle_name: ''
  });
  useEffect(() => {
    if (id) {
      fetchUser(Number(id));
    }
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const fetchUser = async (id: number) => {
    try {
      setIsLoading(true)
      await userStore.getUserById(id);
      setUser(userStore.currentUser)
      // setStatus(request.status)
    } catch (err) {
      setError("Ошибка при загрузке данных");
    }
    setIsLoading(false)
  };
const handleSubmit = async (e) => {
  console.log('handleSubmit')
    e.preventDefault();
    try {
      await userStore.changeUser(user as ChangeUserModel, Number(id))
      // await axios.put(`/api/users/${id}/`, user); // адаптируй URL и метод, если нужно
      setSuccess('Данные успешно обновлены');
      setError(null);
    } catch (e) {
      setError('Ошибка при сохранении данных');
      setSuccess(null);
    }
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


  if (!userStore.currentUser) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Пользователь не найден</Alert>
      </Container>
    );
  }

  return (
    <div style={{paddingTop: 76}}>
    <Container style={{ maxWidth: 600 }} className="mt-4">
      <h2>Профиль пользователя</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Логин (нельзя изменить)</Form.Label>
          <Form.Control type="text" value={user.login} disabled readOnly />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            name="name"
            value={user.name}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Отчество</Form.Label>
          <Form.Control
            name="middle_name"
            value={user.middle_name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Статус</Form.Label>
          <Form.Select
            name="user_status"
            value={user.user_status}
            onChange={handleChange}
          >
            <option value="W">Расклейщик</option>
            <option value="M">Администратор</option>
          </Form.Select>

        </Form.Group>

        <Button variant="primary" type="submit">
          Сохранить
        </Button>
      </Form>
    </Container>
    </div>
  );
});

export default UserDetails;