import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Button from "../components/Button/Button";
import Input from "../components/Login/Input";
import urls from "../utils/urls";
import userStore from "../stores/userStore/UserStore";
import { observer } from "mobx-react";

export const Login = observer(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [users, setUsers] = useState(undefined);
  const [dataChecks, setDataChecks] = useState(true);
  const [fillFieldsCheck, setFillFieldsCheck] = useState(true);
  
  // useEffect(() => {
  //   getUsers()
  // }, [])
  

  // const getUsers = async (email, password) => {
  //   await fetch(urls.users(), {
  //     method: "GET",
  //     headers: { "X-Api-Key": "key" },
  //   })
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       setUsers(data.data);
  //       // checkData(email, password, data.data);
  //     })
  //     .catch((error) => {
  //       console.log("Error is : ", error);
  //       setIsLoading(false);
  //     });
  // };

  const submitClick = async () => {
    setDataChecks(true);
    setFillFieldsCheck(true);
    const email = document.getElementById("formEmail").value.trim();
    const password = document.getElementById("formPassword").value;
    if (password === "" || email === "") {
      return setFillFieldsCheck(false);
    }
    setIsLoading(true);
    // if (users === undefined) {
    //   return getUsers(email, password);
    // }
    await userStore.login({login:email, password: password}, ()=>setIsLogged(true));
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
      { isLogged ? (
        <>
          <h4>
            Вход выполнен, ваш ID:{" "}
            <b>{JSON.parse(localStorage.getItem("_currentUser")).login}</b>
          </h4>

          <Button type="submit" onClick={navigateClick}>
            Продолжить
          </Button>
        </>
      ) : (
        <>
          <h4>Вход</h4>
          <Input errorMessage={userStore.errorMessage} dataCheck={dataChecks} fieldCheck={fillFieldsCheck}></Input>

          <Button type="submit" onClick={submitClick}>
            {userStore.isLoading ? (
              <Spinner animation="border" />
            ):'Войти'}  
          </Button>
        </>
      )}
    </div>
  );
  //}
});

