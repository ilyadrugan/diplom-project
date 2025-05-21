import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  HashRouter, 
  BrowserRouter
} from "react-router-dom";
import {Login} from "./pages/Login";
import Error from "./pages/Error";
import Registration from "./pages/Registration";
import Main from "./pages/Main";
import RequestDetails from "./pages/RequestDetails";
import Header from "./components/Header/Header";
import Settings from "./pages/Settings";
import userStore from "./stores/userStore/UserStore";
import { observer } from "mobx-react";
import UsersList from "./pages/Users";
import UserDetails from "./pages/UserDetails";

export const App = observer(() => {
  const isAuth = localStorage.getItem("token")? true : false;
  const user = JSON.parse(localStorage.getItem("_currentUser"));

  function RequireAuth({ children }) {
    let location = useLocation();
    if (!isAuth) {
      return <Navigate to="login" state={{ from: location }} replace />;
    }

    return children;
  }
  return (
      
<BrowserRouter>
<Header isAuth={isAuth} />
        <Routes >
       
          <Route
            path="/"
            element={
              <RequireAuth>
                <Main />
              </RequireAuth>
            }
          />
          <Route
              path="/request/:id"
              element={
              <RequireAuth>
                <RequestDetails />
              </RequireAuth>
            }
            />
            <Route
              path="/user/:id"
              element={
              <RequireAuth>
                <UserDetails />
              </RequireAuth>
            }
            />
            <Route
              path="/users"
              element={
              <RequireAuth>
                <UsersList />
              </RequireAuth>
            }
            />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="/login"
            element={isAuth ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/registration"
            element={
              isAuth ? <Navigate to="/" replace /> : <Registration />
            }
          />
          
          <Route path="*" element={<Error />} />
        

      </Routes>
      </BrowserRouter>
      );
})
