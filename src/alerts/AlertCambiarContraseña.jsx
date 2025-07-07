import {
  Box,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  IconButton,
  Grid,
} from "@mui/material";
import OtpInput from "react-otp-input";
import requests from "../components/AxiosCalls/AxiosCallsLocal";
//REACT
import React, { useState, useEffect } from "react";
//COMPONENTES MUI MATERIAL
import { TextFieldGeneral } from "../Styles/TextField/TextField";
import { useUserContenidoContext } from "../hooks/UserConteProvider";
import {
  ENVIAR_CODIGO_PASS,
  ENVIAR_CORREO_PASS,
  CAMBIAR_PASS,
} from "../Constants/ApiConstants";
import { data } from "jquery";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AlertCambiarContraseña = (props) => {
  const user = useUserContenidoContext();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("s");
  const [activeStep, setActiveStep] = useState(0); // Controla el paso actual
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState("");
  const [codigoError, setCodigoError] = useState(false);
  const [codigoHelperText, setCodigoHelperText] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState("");

  // Pasos del proceso
  const steps = ["Ingresa tu correo", "Verifica el código", "Nueva contraseña"];
  const handleCancel = () => {
    setEmail("");
    setCodigo("");
    setActiveStep(0);
    props.onClose();
  };
  const validarEmail = (correo) => {
    const emailRegex = /^.*$/;
    if (!correo.trim())
      return { error: true, mensaje: "El correo electrónico es obligatorio." };
    if (!emailRegex.test(correo))
      return { error: true, mensaje: "Ingresa un correo electrónico válido." };
    return { error: false, mensaje: "" };
  };

  const validarCodigo = (codigo) => {
    if (!/^\d{6}$/.test(codigo)) {
      return {
        error: true,
        mensaje: "Debes ingresar los 6 dígitos del código.",
      };
    }
    return { error: false, mensaje: "" };
  };
  const validarPassword = (pass) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!pass.trim()) {
      return { error: true, mensaje: "La contraseña es obligatoria." };
    }
    if (!passwordRegex.test(pass)) {
      return {
        error: true,
        mensaje: (
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>Al menos 8 caracteres</li>
            <li>1 letra mayúscula</li>
            <li>1 letra minúscula</li>
            <li>1 número</li>
            <li>1 carácter especial</li>
          </ul>
        ),
      };
    }
    return { error: false, mensaje: "" };
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      switch (activeStep) {
        case 0: // Paso 1 (correo)
          const result = validarEmail(email);
          if (result.error) {
            setEmailError(true);
            setEmailHelperText(result.mensaje);
            return;
          }
          setEmailError(false);
          setEmailHelperText("");
          enviarCorreo();
        case 1:
          const resultCodigo = validarCodigo(codigo);
          if (resultCodigo.error) {
            setCodigoError(true);
            setCodigoHelperText(resultCodigo.mensaje);
            return;
          }

          setCodigoError(false);
          setCodigoHelperText("");
          enviarCodigo();
          break;

        default:
          console.error("Paso no válido");
      }
    } else {
      // Validación de contraseña
      const resultPass = validarPassword(nuevaContraseña);
      if (resultPass.error) {
        setPasswordError(true);
        setPasswordHelperText(resultPass.mensaje);
        return;
      }

      setPasswordError(false);
      setPasswordHelperText("");
      cambioContraseña();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      handleCancel(); // Cierra el modal si está en el primer paso
    }
  };

  //traer correo segun usuario

   


  ///////////////////////////

  const enviarCorreo = () => {
    data = {
      email: email,
    };
    props.props.setOpenLoadingScreen();
    requests
      .postToken(ENVIAR_CORREO_PASS, data)
      .then((response) => {
        setActiveStep(activeStep + 1);
        props.props.setMessageSnackBar(response.data.message, "success");
        props.props.setCloseLoadingScreen();
      })
      .catch((error) => {
        props.props.setMessageSnackBar(error.response.data.message, "warning");
        props.props.setCloseLoadingScreen();
      });
  };

  const enviarCodigo = () => {
    data = {
      email: email,
      codigo: codigo,
    };
    props.props.setOpenLoadingScreen();
    requests
      .postToken(ENVIAR_CODIGO_PASS, data)
      .then((response) => {
        setActiveStep(activeStep + 1);
        props.props.setMessageSnackBar(response.data.message, "success");
        props.props.setCloseLoadingScreen();
      })
      .catch((error) => {
        props.props.setMessageSnackBar(error.response.data.message, "warning");
        props.props.setCloseLoadingScreen();
      });
  };
  const [showPassword2, setShowPassword2] = useState(false);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  const handleMouseDownPassword2 = (event) => {
    event.preventDefault();
  };
  const cambioContraseña = async () => {
    // Validación básica frontend

    data = {
      codigo: codigo,
      nuevaPass: nuevaContraseña,
      email: email,
    };

    props.props.setOpenLoadingScreen();
    requests
      .postToken(CAMBIAR_PASS, data)
      .then((response) => {
        handleCancel();
        props.props.setMessageSnackBar(response.data.message, "success");
        props.props.setCloseLoadingScreen();
      })
      .catch((error) => {
        props.props.setMessageSnackBar(error.response.data.message, "warning");
        props.props.setCloseLoadingScreen();
      });
  };
  useEffect(() => {
    setEmail(props.correo || "");
  }, [props.correo]);
  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        PaperProps={{
          style: {
            backgroundColor: "#F6F6FF",
            maxHeight: "250%",
            minWidth: "650px",
            maxWidth: "650px",
          },
        }}
      >
        <Box sx={{ border: "1px solid black", p: 2 }}>
          {/* Stepper (Barra de progreso) */}
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Contenido según el paso */}
          {activeStep === 0 && (
            <center>
              <Grid item xs={12} sm={6} md={6}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Ingresa tu correo electrónico o usuario
                  </Typography>
                  <TextFieldGeneral
                    fullWidth
                    label="Usuario o correo electrónico"
                    type="text"
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      const result = validarEmail(val);
                      setEmailError(result.error);
                      setEmailHelperText(result.mensaje);
                    }}
                    error={emailError}
                    helperText={emailHelperText}
                    sx={{ mb: 2 }}
                  />
                </Box>
              </Grid>
            </center>
          )}

          {activeStep === 1 && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ textAlign: "center", mb: 2 }}
            >
              {/* Componente react-otp-input */}
              <OtpInput
                value={codigo}
                onChange={(val) => {
                  setCodigo(val);
                  if (codigoError) {
                    // Solo limpia si había error
                    setCodigoError(false);
                    setCodigoHelperText("");
                  }
                }}
                numInputs={6}
                inputType="text" // Cambiado a texto
                renderInput={(props) => (
                  <input
                    {...props}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) e.preventDefault(); // Solo permite números
                    }}
                  />
                )}
                inputStyle={{
                  width: "50px",
                  height: "50px",
                  fontSize: "1.2rem",
                  borderRadius: "4px",
                  border: `1px solid ${codigoError && codigo.length > 0 ? "#f44336" : "#ccc"}`,
                  margin: "0 5px",
                  textAlign: "center",
                }}
                shouldAutoFocus
              />
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  color: codigoError ? "error.main" : "text.secondary",
                }}
              >
                {codigoError
                  ? codigoHelperText
                  : "Revisa tu correo e ingresa el código que te enviamos."}
              </Typography>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Crea una nueva contraseña
              </Typography>
              <TextFieldGeneral
                fullWidth
                label="Nueva contraseña"
                value={nuevaContraseña}
                onChange={(e) => {
                  const val = e.target.value;
                  setNuevaContraseña(val);
                  const result = validarPassword(val);
                  setPasswordError(result.error);
                  setPasswordHelperText(result.mensaje);
                }}
                error={passwordError}
                helperText={passwordHelperText}
                sx={{ mb: 2 }}
                type={showPassword2 ? "text" : "password"}
                InputProps={{
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
                  ),
                }}
              />
            </Box>
          )}

          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}
          >
            {/* //### ** 
         <Button
            className="btn-aceptar"
            onClick={handleBack}
            variant={"contained"}
          >
            Regresar
          </Button>
            */}
            <Button
              className="btn-aceptar"
              onClick={handleNext}
              variant={"contained"}
            >
              Siguiente
            </Button>

            <Button
              className="btn-cancelar"
              onClick={handleCancel}
              variant={"contained"}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};
export default AlertCambiarContraseña;
