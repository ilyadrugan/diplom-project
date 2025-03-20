import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import Button from "../components/Button/Button";
import Input from "../components/Login/Input";
import urls from "../utils/urls";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [users, setUsers] = useState(undefined);
  const [dataChecks, setDataChecks] = useState(true);
  const [fillFieldsCheck, setFillFieldsCheck] = useState(true);
  
  const getUsers = (email, password) => {
    fetch(urls.users(), {
      method: "GET",
      headers: { "X-Api-Key": "key" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUsers(data.data);
        checkData(email, password, data.data);
      })
      .catch((error) => {
        console.log("Error is : ", error);
        setIsLoading(false);
      });
  };
  const checkData = async (email, password, dataUsers) => {
    const usersArr = users || dataUsers;
    const curUser = usersArr.find(
      (user) => user.email === email && user.password === password
    );
    if (curUser) {
      await sessionStorage.setItem("isAuth", true);
      await sessionStorage.setItem("_currentUser", JSON.stringify(curUser));
      setIsLogged(true);
    }
    setIsLoading(false);
    return setDataChecks(false);
  };
  const submitClick = () => {
    setDataChecks(true);
    setFillFieldsCheck(true);
    const email = document.getElementById("formEmail").value.trim();
    const password = document.getElementById("formPassword").value;
    if (password === "" || email === "") {
      return setFillFieldsCheck(false);
    }
    setIsLoading(true);
    if (users === undefined) {
      return getUsers(email, password);
    }
    checkData(email, password);
  };

  const navigateClick = () => {
    //navigate("/", { replace: true });
    document.location.reload();
  };


  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: 600,
        margin: "auto",
        top: 200,
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      {isLoading ? (
        <Spinner animation="border" />
      ) : isLogged ? (
        <>
          <h4>
            Вход выполнен, ваш ID:{" "}
            <b>{JSON.parse(sessionStorage.getItem("_currentUser")).login}</b>
          </h4>

          <Button type="submit" onClick={navigateClick}>
            Продолжить
          </Button>
        </>
      ) : (
        <>
          <h4>Вход</h4>
          <Input dataCheck={dataChecks} fieldCheck={fillFieldsCheck}></Input>

          <Button type="submit" onClick={submitClick}>
            Войти
          </Button>
        </>
      )}
    </div>
  );
  //}
};

export default Login;
