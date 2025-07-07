import axios from "axios";
// ,import { Navigate } from "react-router-dom";
import { SING_IN } from '../Constants/ApiConstants';
const LoginServices = () => {
  const baseUrl = Response.baseURL.getBaseUrl;
  const tokenName = "sesion";
  const getLocalToken = () => {
    return JSON.parse(sessionStorage.getItem(tokenName));
  };

  const isLoggedIn = () => !!getLocalToken;
  // const navigate = useNavigate();
  const logIn = (user) => {
    return new Promise((resolve, reject) => {
      const instance = axios.create({
        baseURL: baseUrl,
        headers: {
          "Content-Type": "application/json",
        },
      });

      instance
        .post(SING_IN, user)

        .then((r) => {
          resolve(r.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  const logOut = () => {
    sessionStorage.removeItem(tokenName);
    localStorage.removeItem("expireTime");
    return window.location.reload();
  };

  return {
    logIn,
    getLocalToken,
    isLoggedIn,
    logOut,
  };
};

export default LoginServices();
