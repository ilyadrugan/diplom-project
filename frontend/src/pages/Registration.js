import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import Input from "../components/Registration/Input";
import urls from "../utils/urls";


const Registration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState(undefined);
  const [inputEmail, setInputEmail] = useState('')
  const [passwordEqual, setPasswordEqual] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [emailIsNotFree, setEmailIsNotFree] = useState(false);
  const [emailIsNotValid, setEmailIsNotValid] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [userCreatedID, setUserCreatedID] = useState(null);
  const navigate = useNavigate()
  const getUsers = (email, password) => {
    fetch(urls.users(), {
      method: "GET",
      headers: { "X-Api-Key": "key" },
    })
    .then((resp) => resp.json())
    .then((data) => {
      setUsers(data.data);
      checkValidEmail(email,data.data, password)
    })
    .catch((error) => {
      console.log("Error is : ", error);
      setIsLoading(false);
    });
  };
  const createUser = (email, password, tmpID)=>{
    const formData = new FormData();
    formData.append('login', tmpID);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('user_status', 'worker');
    fetch(urls.users(), {
        method: "POST",
        body: formData,
        headers: { "X-Api-Key": "key" },
      })
      .then((resp) => resp.json())
      .then((data) => {
        setUserCreatedID(tmpID)
        setUserCreated(true)
        setIsLoading(false);

      })
      .catch((error) => {
        console.log("Error is : ", error);
        setIsLoading(false);
      });
  }
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }
  const checkValidEmail = (email, dataUsers, password)=>{
    const curUser = dataUsers.find(user => user.email===email);
    if (curUser){
        setEmailIsNotFree(true)
        return setIsLoading(false);
    }
    let tmpID = null
    while(!tmpID || dataUsers.find(user=>user.login===Number(tmpID))){
        tmpID = getRndInteger(0, 99999).toString()
        while (tmpID.length<5){
            tmpID = `0${tmpID}`
        }
    }
    createUser(email, password, tmpID)
  }
  const submitClick = () => {
    setEmailIsNotValid(false)
    setEmailIsNotFree(false)
    setPasswordEqual(true)
    setPasswordValid(true)
    
    const email = document.getElementById("registrEmail").value.trim();
    setInputEmail(email)
    const password = document.getElementById("registrPassword").value;
    const repeatPassword = document.getElementById("repeatPassword").value;
    if (password !==repeatPassword){
        return setPasswordEqual(false)
    }
    if (password.length < 6){
        return setPasswordValid(false)
    }
    if (!validateEmail(email)){
      return setEmailIsNotValid(true)
    }
    if (users === undefined) {
        setIsLoading(true);
        return getUsers(email, password);
    }

    setIsLoading(true);
    checkValidEmail(email, users, password)
  };
  window.addEventListener('beforeunload',function(e){
    e.preventDefault()
    navigate("/", { replace: true });
    document.location.reload();
  })
  const navigateClick = ()=>{
    navigate('/login',{replace:true});
  }
  return (
    <div
      style={{
        display: "flex",
        position:'relative',
        width: 600,
        margin: "auto",
        top:200,
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
     
      {isLoading ? (
        <Spinner animation="border" />
      ) : userCreated?<>
      <h4>Регистрация выполнена, ваш ID: <b>{userCreatedID}</b></h4>

          <Button type="submit" onClick={navigateClick}>
            Перейти ко входу
          </Button>
      </>:(
        <>
         <h4>Регистрация</h4>
          <Input inputEmail={inputEmail} emailNotValid={emailIsNotValid} emailNotFree={emailIsNotFree} passwordsCheck={passwordEqual} passwordsLen={passwordValid}></Input>

          <Button type="submit" onClick={submitClick}>
            Зарегистрироваться
          </Button>
        </>
      )}
    </div>
  );
  //}
};

export default Registration;
