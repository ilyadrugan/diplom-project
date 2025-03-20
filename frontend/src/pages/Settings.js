import React, { useEffect, useState } from "react";
import { Button, Form, Col, FloatingLabel, Row, Spinner } from "react-bootstrap";
import urls from "../utils/urls";
import styles from "./styles/PageStyles.module.css";

const Settings = () => {
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAddType, setFailedAddType] = useState(false)
  const [successAddType, setSuccessAddType] = useState(false)
  const [successDeleteType, setSuccessDeleteType] = useState(false)

  const getTypes = () => {
    fetch(urls.types(), {
      method: "GET",
      headers: { "X-Api-Key": "key" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTypes(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error is : ", error);
        setIsLoading(false);
      });
  };
  const deleteType = () => {
    const typeID = document.getElementById("selectType").value;
    setIsLoading(true)
    fetch(urls.types()+typeID, {
      method: "DELETE",
      headers: { "X-Api-Key": "key" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTypes(types.filter(type=>type.id.toString()!==typeID));
        setSuccessDeleteType(true)
        setTimeout(()=>setSuccessDeleteType(false), 2500)
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error is : ", error);
        setTypes(types.filter(type=>type.id.toString()!==typeID));
        setSuccessDeleteType(true)
        setTimeout(()=>setSuccessDeleteType(false), 2500)
        setIsLoading(false);
      });
  };
  const addType = () => {
    const newTypeName = document.getElementById("inputNewType").value.trim();
    if(newTypeName.length<1){
        setTimeout(()=>setFailedAddType(false), 2500)
        return setFailedAddType(true)
    }
    setIsLoading(true)
    const formData = new FormData();
    formData.append('type_name', newTypeName);
    fetch(urls.types(), {
      method: "POST",
      body:formData,
      headers: { "X-Api-Key": "key" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTypes(types.concat(data));
        setSuccessAddType(true)
        setTimeout(()=>setSuccessAddType(false), 2500)
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error is : ", error);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    setIsLoading(true);
    getTypes();
  }, []);
  return (
    <div className={styles.settings_container}>
    <div className={styles.settings_params_title}><b>Типы</b>      </div>
      <Row className="g-2">
        <Col md>

          <FloatingLabel
            controlId="inputNewType"
            label="Добавить новый тип объявления"
          >
            <Form.Control />
          </FloatingLabel>
          <Button
            style={{ width: "100%", marginTop: 10 }}
            variant="outline-primary"
            onClick={addType}
            disabled={isLoading}
          >
            Добавить
          </Button>
          {failedAddType && <div className={styles.text_red}>Введите хотя бы 1 символ</div>}
          {successAddType && <div className={styles.text_green}>Новый тип объявления успешно добавлен</div>}

        </Col>
        <Col md>
          <FloatingLabel controlId="selectType" label="Типы объявлений">
            <Form.Select aria-label="Floating label select example">
                {isLoading? <Spinner animation="border" />:types.map((type) => (
                 <option key={type.id+type.type_name} value={type.id}>{type.type_name}</option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <Button
            style={{ width: "100%", marginTop: 10 }}
            variant="outline-danger"
            disabled={isLoading}
            onClick={deleteType}
          >
            Удалить
          </Button>
          {successDeleteType && <div className={styles.text_green}>Тип объявления успешно удалён</div>}

        </Col>
      </Row>

    </div>
  );
};
export default Settings;
