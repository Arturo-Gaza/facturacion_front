import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Theme from '../../Styles/Theme';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useFormik } from 'formik';
import * as Yup from 'yup';

//import { useNavigate } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../../Constants/ApiConstants';
import { TextFailedLogin } from '../../Styles/TextField/TextField';
import requests from '../../components/AxiosCalls/AxiosCallsLocal';

import { SOLICITUD } from '../../Constants/NavegacionRoutes';
import { FooterLayout } from '../../Layouts/Login/FooterLayout';
import HeaderLayout from '../../Layouts/Login/HeaderLayout';
import AlertCambiarContraseña from '../../alerts/AlertCambiarContraseña';
import { useUserContenidoContext } from '../../hooks/UserConteProvider';
import GoogleLoginButton from '../../components/GoogleLoginButton';

import GoogleButton from '../../components/GoogleButton';


const theme = createTheme();

const SignInSide = (props) => {

  //:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::
  const user = useUserContenidoContext();
  //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  const navigate = useNavigate();

  const [_RPasswordAlert, setRPasswordAlert] = useState(false);
  const rPasswordAlertOpen = () => {
    setRPasswordAlert(true);
  };
  const rPasswordAlertClose = () => {
    setRPasswordAlert(false);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('El usuario es requerido'),
      password: Yup.string()
        .required('La contraseña es requerido'),
    }),
    onSubmit: async (values) => {
      props.setOpenLoadingScreen()
      var data = {
        "email": values.email,
        "password": values.password,
      };
      requests.post(LOGIN_USER, data)
        .then((response) => {
          props.setMessageSnackBar('Se inició sesión correctamente.', 'success');
          sessionStorage.setItem('sesion', true);
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('idUsuario', response.data.data.id);
          sessionStorage.setItem('user', response.data.data.user);
          sessionStorage.setItem('nombre', response.data.data.name + ' ' + response.data.data.apellidoP + ' ' + response.data.data.apellidoM);
          sessionStorage.setItem('idRol', response.data.data.idRol);
          sessionStorage.setItem('nameRol', response.data.data.descripcion_rol);
          sessionStorage.setItem('email', response.data.data.email);
          sessionStorage.setItem('departameto', response.data.data.descripcio_depatamento);
          sessionStorage.setItem('idDepartamento', response.data.data.id_departamento);
          //window.location.reload();
          window.location.assign(SOLICITUD);
          props.setCloseLoadingScreen()
        })
        .catch((error) => {
          console.log('VER MI ERRORS', error)
          error.response.data.errors.forEach(element => {
            props.setMessageSnackBar(element, 'warning');
          });
          props.setCloseLoadingScreen()
        })
    },

  }
  );

  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };

  const MyComponent = () => {
    return <img width={'100%'} height={'100%'} src={props.AlltubLogo} />
  }
  ////_::::::::MODAL CABIAR CONTRASEÑA::::::::::
  const [modalAbierto, setModalAbierto] = useState(false);

  const onCloseModal = () => {
    setModalAbierto(!modalAbierto);
  };

  useEffect(() => {
 const handleMessage = (event) => {
  console.log("entra aqui")
  console.log(event.origin)
    console.log(window.location.origin)

      if (event.data?.status) {
        const data = event.data;

        // Guardar en sessionStorage
        sessionStorage.setItem("sesion", true);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("idUsuario", data.user.id);
        sessionStorage.setItem("user", data.user.user);
        sessionStorage.setItem("nombre", data.user.name + " " + data.user.apellidoP + " " + data.user.apellidoM);
        sessionStorage.setItem("idRol", data.user.idRol);
        sessionStorage.setItem("nameRol", data.user.descripcion_rol);
        sessionStorage.setItem("email", data.user.email);
        sessionStorage.setItem("departameto", data.user.descripcio_depatamento);
        sessionStorage.setItem("idDepartamento", data.user.id_departamento);

        // Cerrar loader y redirigir
        props.setCloseLoadingScreen();
        window.location.assign(SOLICITUD); // 🚀 tu ruta de Home
      } else if (event.data?.error) {
        console.error("Error Google:", event.data.error);
        props.setCloseLoadingScreen();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);

  }, [props]);
  return (
    <div>

      <ThemeProvider theme={Theme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <HeaderLayout sx={{ mt: 5 }} props={props} />
          <Grid container component={Paper} elevation={6} square>

            <Grid item xs={12} sm={6} md={6}>
              <Box
                sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >

              </Box>
              <Box
                style={{ paddingTop: '3%' }}
                sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <MyComponent />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6} style={{ paddingTop: '5%' }}>
              <Box
                sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                  <LockOutlinedIcon sx={{ color: '#ffffff' }} />
                </Avatar>
  

                <Typography component="h1" variant="h6">
                  Iniciar sesión
                </Typography>
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                  <div>
                    <label className='labelLogin'>Correo electrónico</label>
                    <TextFailedLogin
                      className='inputText1'
                      id="email"
                      name="email"
                      color='primary'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      inputProps={{ autoComplete: 'none' }}
                    />
                  </div>
                  <div>
                    <a style={{ color: 'red', fontSize: '0.9em' }}>
                      {formik.touched.email && formik.errors.email}
                    </a>
                  </div>
                  <div>
                    <label className='labelLogin'>Contraseña</label>
                    <TextFailedLogin
                      className='inputText1'
                      name="password"
                      id="password"
                      color='primary'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      inputProps={{ autoComplete: 'none' }}
                      type={showPassword2 ? 'text' : 'password'}
                      InputProps={
                        {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword2}
                                onMouseDown={handleMouseDownPassword2}
                                //
                                edge="end"
                              >
                                {showPassword2 ? <VisibilityOff /> : <Visibility />}

                              </IconButton>
                            </InputAdornment>
                          )
                        }
                      }
                    />
                  </div>
                  <div>
                    <a style={{ color: 'red', fontSize: '0.9em' }}>
                      {formik.touched.password && formik.errors.password}

                    </a>
                  </div>
                  <br></br>
               
                  <Grid className='margin2'>
                    <center>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className='btn-aceptar'
                      >
                        Acceder
                      </Button>
                      
                      <p className="texto-cambio-contraseña">
                        ¿Olvidaste tu contraseña?{" "}
                        <a
                          href="#!"
                          onClick={(e) => {
                            e.preventDefault(); // Evita que el enlace recargue la página
                            setModalAbierto(true);
                          }}
                        >
                          Cambiar aquí
                        </a>
                      </p>
                       <GoogleButton
      href="http://127.0.0.1:8000/auth/google"
      text="Iniciar sesión con Google"
      variant="contained"
      onStart={() => props.setOpenLoadingScreen?.()}
    />
                    </center>
                  </Grid>
                  <br></br>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <Box
                sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <FooterLayout sx={{ mt: 5 }} />
              </Box>
            </Grid>
          </Grid>

        </Grid>

      </ThemeProvider>
      <AlertCambiarContraseña
        open={modalAbierto}
        onClose={onCloseModal}
        props={props}
        correo={formik.values.email}
      />
    </div>
  );
}

export default SignInSide


