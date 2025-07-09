import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
//importamos el componente LoadingScreen y el SnackBar
import { useNavigate } from "react-router-dom"
import requests from '../components/AxiosCalls/AxiosCallsLocal'
import { LOGOUT_USER } from '../Constants/ApiConstants'
import { CATALOGOS, CREARSOLICITUD, HOME, ROLES, SOLICITUD, USUARIOS } from '../Constants/NavegacionRoutes'
import { useUserContenidoContext } from '../hooks/UserConteProvider'
import HeaderLayoutDashboard from '../Layouts/Dashboard/HeaderLayout'
import { ProtectedRouteRolAdministrador } from '../Utils/ProtectedRoute'
import Catalogos from '../Views/Catalogos/Catalogos'
import Roles from '../Views/Roles/Roles'
import Usuarios from '../Views/Usuarios/Usuarios'

import CotizarSolicitud from '../Views/Solicitud/CotizarSolicitud'
import CrearSolicitud from '../Views/Solicitud/CrearSolicitud'
import EditarSolicitud from '../Views/Solicitud/EditarSolicitud'
import Solicitud from '../Views/Solicitud/Solicitud'



const RoutesToken = ({ AlltubLogo, setMessageSnackBar, setCloseLoadingScreen, setOpenLoadingScreen, setMsjLoadingScreen }) => {
  const Token = true
  const user = useUserContenidoContext();

  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //:::::::::::::::::::::::: [LOG_OUT] ::::::::::::::::::::::::::::::::::::::::::::::::::::
  const navigate = useNavigate();
  const log_Out = () => {
    setOpenLoadingScreen();
    requests.getToken(LOGOUT_USER + user.idUsuario)
      .then((response) => {
        setMessageSnackBar('Se cerro la sesión correctamente.', 'success');
        setCloseLoadingScreen()
        sessionStorage.clear()
        localStorage.removeItem("expireTime");
        navigate('/')
        window.location.reload();
      })
      .catch((error) => {
        error.data.errors.forEach(element => {
          setMessageSnackBar(element, 'error');
        });
        setCloseLoadingScreen();
      })
  }
  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //:::::::::::::::::::::::: [FUNCION CHECK INACTIVITY] :::::::::::::::::::::::::::::::::::
  const [_loggedIn, setLoggedIn] = useState(true)
  const checkForInactivity = () => {
    const expireTime = localStorage.getItem("expireTime");
    if (expireTime < Date.now()) {
      setLoggedIn(false)
      log_Out();
    }
  }

  const updateExpireTime = () => {
    const expireTime = Date.now() + 900000;
    localStorage.setItem("expireTime", expireTime);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      checkForInactivity();
    }, 900000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    updateExpireTime();
    window.addEventListener("click", updateExpireTime);
    window.addEventListener("keypress", updateExpireTime);
    window.addEventListener("scroll", updateExpireTime);
    window.addEventListener("mousemove", updateExpireTime);
    return () => {
      window.removeEventListener("click", updateExpireTime);
      window.removeEventListener("keypress", updateExpireTime);
      window.removeEventListener("scroll", updateExpireTime);
      window.removeEventListener("mousemove", updateExpireTime);
    }
  }, []);

  return (
    <>
      <HeaderLayoutDashboard
        setOpenLoadingScreen={setOpenLoadingScreen}
        setCloseLoadingScreen={setCloseLoadingScreen}
        setMessageSnackBar={setMessageSnackBar}
        setMsjLoadingScreen={setMsjLoadingScreen}

        AlltubLogo={AlltubLogo}
      />
      {/* ::::::::::::::: ADMINISTRADOR GENERAL ::::::::::::::::::::: */}
      <Routes>
        <Route
          path={SOLICITUD}
          element={
            <Solicitud
              setOpenLoadingScreen={setOpenLoadingScreen}
              setCloseLoadingScreen={setCloseLoadingScreen}
              setMessageSnackBar={setMessageSnackBar}
              setMsjLoadingScreen={setMsjLoadingScreen}
            />
          }
        />

        <Route
          path={CREARSOLICITUD}
          element={
            <CrearSolicitud
              setOpenLoadingScreen={setOpenLoadingScreen}
              setCloseLoadingScreen={setCloseLoadingScreen}
              setMessageSnackBar={setMessageSnackBar}
              setMsjLoadingScreen={setMsjLoadingScreen}
            />}
        />

        <Route
          path={'/Solicitud/Editar/:id'}
          element={
            <EditarSolicitud
              setOpenLoadingScreen={setOpenLoadingScreen}
              setCloseLoadingScreen={setCloseLoadingScreen}
              setMessageSnackBar={setMessageSnackBar}
              setMsjLoadingScreen={setMsjLoadingScreen}
            />}
        />

        <Route
          path={'/Solicitud/Cotizar/:id'}
          element={
            <CotizarSolicitud
              setOpenLoadingScreen={setOpenLoadingScreen}
              setCloseLoadingScreen={setCloseLoadingScreen}
              setMessageSnackBar={setMessageSnackBar}
              setMsjLoadingScreen={setMsjLoadingScreen}
            />}
        />

        <Route
          path={HOME}
          element={
            <Solicitud
              setOpenLoadingScreen={setOpenLoadingScreen}
              setCloseLoadingScreen={setCloseLoadingScreen}
              setMessageSnackBar={setMessageSnackBar}
              setMsjLoadingScreen={setMsjLoadingScreen}
            />
          }
        />

        <Route
          element={<ProtectedRouteRolAdministrador canActivate={user.idRol} redirectPath="/" />}
        >
          <Route
            path={CATALOGOS}
            element={
              <Catalogos
                setOpenLoadingScreen={setOpenLoadingScreen}
                setCloseLoadingScreen={setCloseLoadingScreen}
                setMessageSnackBar={setMessageSnackBar}
                setMsjLoadingScreen={setMsjLoadingScreen}
              />
            }
          />

          <Route
            path={USUARIOS}
            element={
              <Usuarios
                setOpenLoadingScreen={setOpenLoadingScreen}
                setCloseLoadingScreen={setCloseLoadingScreen}
                setMessageSnackBar={setMessageSnackBar}
                setMsjLoadingScreen={setMsjLoadingScreen}
              />
            }
          />

          <Route
            path={ROLES}
            element={
              <Roles
                setOpenLoadingScreen={setOpenLoadingScreen}
                setCloseLoadingScreen={setCloseLoadingScreen}
                setMessageSnackBar={setMessageSnackBar}
                setMsjLoadingScreen={setMsjLoadingScreen}
              />
            }
          />

        </Route>


      </Routes >
    </>
  );
}

export default RoutesToken