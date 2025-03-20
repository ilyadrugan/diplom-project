import styles from "./Registration.module.css";
import React from "react";
import { Form } from "react-bootstrap";

const Input = (props) => {
  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="registrEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control  type="email" placeholder="Введите email" defaultValue={props.inputEmail}/>
          {props.emailNotFree && <div className={styles.text_red}>Такой email уже зарегистрирован</div>}
          {props.emailNotValid && <div className={styles.text_red}>Введён некорректный email</div>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="registrPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control type="password" placeholder="Пароль" />
          <Form.Text className="text-muted">
          Пароль должен состоять хотя бы из 6 символов
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="repeatPassword">
          <Form.Label>Повтор пароля</Form.Label>
          <Form.Control type="password" placeholder="Пароль" />
          {!props.passwordsCheck && <div className={styles.text_red}>Пароли не совпадают</div>}
          {!props.passwordsLen && <div className={styles.text_red}>Пароль слишком короткий</div>}
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Check me out" />
  </Form.Group> */}
      </Form>
    </>
  );
};
export default Input;
