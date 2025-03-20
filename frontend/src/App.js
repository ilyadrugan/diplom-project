import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  HashRouter 
} from "react-router-dom";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Registration from "./pages/Registration";
import Main from "./pages/Main";
import Header from "./components/Header/Header";
import Settings from "./pages/Settings";

function App() {
  const isAuth = JSON.parse(sessionStorage.getItem("isAuth"));
  const user = JSON.parse(sessionStorage.getItem("_currentUser"));

  function RequireAuth({ children }) {
    let location = useLocation();
    if (!isAuth) {
      return <Navigate to="login" state={{ from: location }} replace />;
    }

    return children;
  }
  return (
      
<HashRouter>
<Header isAuth={isAuth} />
        <Routes >
        {/* <Route path='/' element={<Header isAuth={isAuth} />}> */}

          {/* <Route  path="/" element={isAuth ?  <Navigate  to="/dashboard" replace /> : <Navigate  to="/login" replace />}/> */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Main />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              isAuth ? (
                user.user_status === "master" ? (
                  <Settings />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
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
      </HashRouter>
      );
}

export default App;
