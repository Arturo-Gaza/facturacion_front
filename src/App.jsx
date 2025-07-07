import { CssBaseline, IconButton } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import RoutesPublicas from './Routing/RoutesPublicas'
import RoutesToken from './Routing/RoutesToken'
import { ColorModeContext, useMode } from './theme'
//STILOS//
import '../src/Styles/StylesGenerla.css'

//LOGO
import { closeSnackbar, useSnackbar } from 'notistack'
import AlltubLogo from "../src/Images/AlltubLogo.png"
import { useUserContenidoContext, useUserSetContenidoContext } from './hooks/UserConteProvider'
import LoadingScreen from './Utils/LoadingScreen'
import CloseIcon from '@mui/icons-material/Close';



const App = () => {
  //:::::::::::::::::::::: UserConteProvider [CONTEXT] :::::::::::::::::::::::
  const user = useUserContenidoContext();
  const setContenido = useUserSetContenidoContext();
  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  //:::::::::::::::::::::::: [SET LOADING Y SNACKBAR] :::::::::::::
  //Funcion para abrir el loading screen
  //Funcion para cerrar el loading screen
  //Funcion que le setea valor TRUE al estado LSopen
  //Funcion que le setea valor FALSE al estado LSopen
  const [LSopen, setLSOpen] = useState(false)
  const [Msj, setMsjLoadingScreen] = useState('')
  const [getAcceso, setGetAcceso] = useState(1)
  const setOpenLoadingScreen = () => {
    setLSOpen(true)
  }
  const setCloseLoadingScreen = () => {
    setLSOpen(false)
  }
  //:::::::::::::::::::::: AlertasSnakbar :::::::::::::::::::::::
  const { enqueueSnackbar } = useSnackbar();
  const action = snackbarId => (
    <IconButton
      aria-label="delete"
      size="small"
      onClick={() => { closeSnackbar(snackbarId) }}
    >
      <CloseIcon sx={{ color: 'white' }} />
    </IconButton>

  );

  const setMessageSnackBar = (mensaje, variant) => {
    enqueueSnackbar(mensaje, {
      action,
      variant: variant,
      anchorOrigin: { horizontal: 'right', vertical: 'top' },
      autoHideDuration: 6000,
    });
  };

  ///////////////////////////////////////////////////////////////
  const [theme, colorMode] = useMode();
  // useEffect hook que recibe como parámetro una función que se ejecutará cada vez
  // que nuestro componente se renderice, ya sea por un cambio de estado,
  // por recibir props nuevas.

  const getIdUsuario = () => {
    return JSON.parse(sessionStorage.getItem("idUsuario"));
  };

  const getUser = () => {
    return sessionStorage.getItem("user");
  };

  const getSesion = () => {
    return JSON.parse(sessionStorage.getItem("sesion"));
  };

  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  const getNombre = () => {
    return sessionStorage.getItem("nombre");
  };
  const getIdRol = () => {
    return sessionStorage.getItem("idRol");
  };

  const getNameRol = () => {
    return sessionStorage.getItem("nameRol");
  };


  const getEmail = () => {
    return sessionStorage.getItem("email");
  };

  const getDepartamento = () => {
    return sessionStorage.getItem("departameto");
  };
  const getIdDepartamento = () => {
    return sessionStorage.getItem("idDepartamento");
  };

  const CARGAR_COMPLEMENTOS = async () => {
    let DatoPrueba = {
      NombreInst: "SISTEMA DE TICKETS PARA SOLICITUD DE COTIZACIONES DE COMPRAS",
      ColorBanner: '#E0EDBC',
      ColorBannerMenu: 'white',
      ColorTable: '#E0EDBC',
      ColorSubModulos: 'linear-gradient(to bottom right, black,grey, white)',
      idUsuario: getIdUsuario(),
      user: getUser(),
      sesion: getSesion(),
      token: getToken(),
      nombre: getNombre(),
      idRol: getIdRol(),
      nameRol: getNameRol(),
      email: getEmail(),
      departamento: getDepartamento(),
      idDepartamento: getIdDepartamento()
    };
    setContenido(DatoPrueba);
  }

  useEffect(() => {
    getIdUsuario();
    getUser();
    getSesion();
    getToken();
    getNombre();
    getIdRol();
    getNameRol();

    CARGAR_COMPLEMENTOS();
  }, []);

  return (
    // Componente de material ui para poder insertar un tema a los componentes 
    < ColorModeContext.Provider value={colorMode} >
      < ThemeProvider theme={theme} >
        <LoadingScreen open={LSopen} Msj={Msj} />
        <CssBaseline />
        <div className="app">
          <main className="content">
            {
              user.ColorBannerMenu == "" || user.ColorBanner == "" || user.NombreInst == "" ? (null) : (
                !user.sesion ? (
                  <RoutesPublicas
                    setMessageSnackBar={setMessageSnackBar}
                    setOpenLoadingScreen={setOpenLoadingScreen}
                    setCloseLoadingScreen={setCloseLoadingScreen}
                    setMsjLoadingScreen={setMsjLoadingScreen}

                    AlltubLogo={AlltubLogo} />
                ) : (
                  <RoutesToken
                    setMessageSnackBar={setMessageSnackBar}
                    setOpenLoadingScreen={setOpenLoadingScreen}
                    setCloseLoadingScreen={setCloseLoadingScreen}
                    setMsjLoadingScreen={setMsjLoadingScreen}

                    AlltubLogo={AlltubLogo}
                  />
                ))}
          </main>
        </div>
      </ThemeProvider >
    </ColorModeContext.Provider >
  );
}

export default App;
