import styles from "./Header.module.css";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ExitButton from "../Button/ExitButton";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import userStore from "../../stores/userStore/UserStore";
import { observer } from "mobx-react";
const Header = observer(({ isAuth }) => {
  const user=JSON.parse(localStorage.getItem("_currentUser"))
  const navigate = useNavigate();
  const exitClick = () => {
    localStorage.clear();
    navigate('/',{replace:true});
    document.location.reload();
  };
  return (
    <div className={isAuth ? styles.header_auth : styles.headerBack}>
      {user ? (
        <>
          <nav>
            <ExitButton type="submit" onClick={exitClick}>
              Выход
            </ExitButton>
            <NavLink
              className={(props) =>
                props.isActive ? styles.headerText_active : styles.headerText
              }
              to="/"
            >
              Главная
            </NavLink>
            {user.user_status === "M" && (
              <>
              <NavLink
                className={(props) =>
                  props.isActive ? styles.headerText_active : styles.headerText
                }
                to="/settings"
              >
                Настройки
              </NavLink>
              <NavLink
                className={(props) =>
                  props.isActive ? styles.headerText_active : styles.headerText
                }
                to="/users"
              >
                Пользователи
              </NavLink>
              </>
              
            )}

            
          </nav>
          <div className={styles.header_user_info}>
            <OverlayTrigger
              key={"bottom"}
              placement={"bottom"}
              overlay={
                <Tooltip id={`tooltip-bottom`}>
                  <strong>{userStore.user.user_status==='M'?'Администратор':'Расклейщик'}</strong>
                </Tooltip>
              }
            >
              <img
                className={styles.header_img_status}
                src={require(`./assets/${user.user_status}.png`)}
                alt="icon_status"
              />
            </OverlayTrigger>
            <div className={styles.headerIDText}>
              Ваш номер: <b>{user.login}</b>
            </div>
          </div>
        </>
      ) : (
        <nav>
          {/* <NavLink
            className={(props) =>
              props.isActive ? styles.headerText_active : styles.headerText
            }
            to="/registration"
          >
            Регистрация
          </NavLink> */}
          <NavLink
            className={(props) =>
              props.isActive ? styles.headerText_active : styles.headerText
            }
            to="/login"
          >
            Вход
          </NavLink>
        </nav>
      )}
    </div>
  );
});

export default Header;
