import styles from "./Login.module.css";
import React from "react";
import { Form } from "react-bootstrap";

const Input = (props) => {
  return (
    <>
      <Form>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control  type="email" placeholder="Введите email" />
          {/* <Form.Text className="text-muted">
      We'll never share your email with anyone else.
    </Form.Text> */}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Пароль</Form.Label>
          <Form.Control type="password" placeholder="Пароль" />
          <div style={{minHeight: 24}} className={styles.text_red}>{props.errorMessage}</div>
          {!props.fieldCheck && <div className={styles.text_red}>Заполните все поля</div>}

        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
    <Form.Check type="checkbox" label="Check me out" />
  </Form.Group> */}
      </Form>
    </>
  );
};
export default Input;
