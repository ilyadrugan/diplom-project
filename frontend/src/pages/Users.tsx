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
import { Container, Row, Col, Card, Spinner, Alert, Form, Table, OverlayTrigger, Tooltip, Button, Modal } from "react-bootstrap";
import { getRequestStatus } from "../utils/requestStatus";
import { getUserStatusName, getUserStatusRuName } from "../utils/userStatus";
import { CreateUserModel } from "../stores/userStore/models";


const UsersList = observer(() => {
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<CreateUserModel>({
    email: '',
    user_status: 'W',
    name: '',
    last_name: '',
    password: ''
  });
const [showModal, setShowModal] = useState(false);

  useEffect(() => {
      fetchUsers();
  }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
     const handleSubmit = async () => {
        try {
        // тут отправка на сервер
        console.log('Создание пользователя:', formData);
        await userStore.createUser(formData); // если есть такой метод
        setShowModal(false);
        setFormData({
            email: '',
            user_status: 'W',
            name: '',
            last_name: '',
            password: ''
        });
        fetchUsers();
        } catch (e) {
        console.error('Ошибка создания:', e);
        }
  };
  const fetchUsers = async () => {
    try {
      await userStore.getUsers();
      // setStatus(request.status)
    } catch (err) {
      setError("Ошибка при загрузке данных");
    }
  };

  if (userStore.isLoading) {
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
const filteredUsers = userStore.users.filter(user => {
  const query = searchQuery.toLowerCase();
  return (
    user.id.toString().includes(query) ||
    user.login?.toString().toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query) ||
    user.user_status?.toLowerCase().includes(query)
  );
});
  return (
    <div style={{paddingTop: 76}}>

    <div style={{gap: 16, alignItems: 'center'}} className="d-flex justify-content-between mb-3">
        <Form.Control
          type="text"
          placeholder="Поиск по пользователям..."
          // className="mb-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button  variant="primary" onClick={() => setShowModal(true)}>
          Создать
        </Button>
    </div>
    <div style={{marginTop: 16}}></div>
    
    <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              ID
            </th>
            <th>
              Идентификатор
            </th>
            <th>Email</th>
            <th>
              Роль
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => {
           
            return (
              <tr key={user.id}>
                    <td>
                      <a
                      href={`/user/${user.id}`}
                      rel="noopener noreferrer"
                    >{user.id}</a>
                    </td>
                    <td>{user.login}</td>
                    <td>{user.email}</td>
                    <td style={{textAlign: "center"}}>
                        <OverlayTrigger
                                      key={"left"}
                                      placement={"left"}
                                      overlay={
                                        <Tooltip id={`tooltip-left`}>
                                          Роль - <strong>{getUserStatusRuName(user.user_status)}</strong>
                                        </Tooltip>
                                      }
                                    >
                                      <img
                                        style={{height: 32, width: 32}}
                                        src={require(`../components/Header/assets/${getUserStatusName(user.user_status)}.png`)}
                                        alt="icon_status"
                                      />
                                    </OverlayTrigger>
                    </td>
                </tr>
            );
          })}
        </tbody>
      </Table>
       <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Создать пользователя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Фамилия</Form.Label>
              <Form.Control name="last_name" value={formData.last_name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Роль</Form.Label>
              <Form.Select name="user_status" value={formData.user_status} onChange={handleChange}>
                <option value="W">Расклейщик</option>
                <option value="M">Администратор</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={userStore.isCreatingUserLoading} variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button disabled={userStore.isCreatingUserLoading} variant="primary" onClick={handleSubmit}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default UsersList;