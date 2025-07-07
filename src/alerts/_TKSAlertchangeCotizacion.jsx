import { Box, Button, Dialog, DialogContent, Grid } from "@mui/material";
import { useState } from "react";
import { useUserContenidoContext } from "../hooks/UserConteProvider";
import {
  UPDATE_ESTATUS_SOLICITUDES,
  CREATE_OBSERVACIONES_SOLICITUD,
  FORMATEAR_SOLICITUD,
} from "../Constants/ApiConstants";
import requests from "../components/AxiosCalls/AxiosCallsLocal";

const AlertaEnviarCotizacion = (props) => {
  const user = useUserContenidoContext();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xs");
  const [step, setStep] = useState(1);
  const [observacion, setObservacion] = useState("");

  //acciones
  const Enviar = async () => {
    props.props.props.setOpenLoadingScreen();
    await requests
      .postToken(FORMATEAR_SOLICITUD + props.props.props.ticket) //### ** 
      .then((response) => {
        return props.getAllSolicitudDetalle();
        //props.props.estatusCotizacionGlobla = false;
      })
      .catch((error) => {
        props.props.props.setMessageSnackBar(error.Message, 'warning');
      }).finally(() => {
        props.handlecancelar();
        props.props.setEstatusCotizacionGlobal(false)
        props.setCotizacionGeneral(props.evetoTarget === "articulo");
        props.close(false);
      });
  };

  const Cancelar = () => {
    props.close(false);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={Cancelar}
        PaperProps={{
          style: {
            backgroundColor: "#F6F6FF",
            maxHeight: "80vh",
            minWidth: "400px",
            maxWidth: "400px",
          },
        }}
      >
        <Grid style={{ borderRadius: "2px" }}>
          <Grid>
            <DialogContent>
              <Box sx={{ padding: 2 }}>
                <center>
                  <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                    ¿Estás seguro de que deseas cambiar el tipo de cotización?
                  </p>
                  <p style={{ fontSize: '1rem' }}>
                    Ya has comenzado a generar cotizaciones para esta solicitud. 
                    Si continúas, se perderán todos los cambios realizados hasta el momento, incluidos los archivos que hayas adjuntado.
                  </p>
                   <p style={{ fontSize: '1rem' }}>
                    Para continuar con la nueva opción de cotización, deberás volver a presionar el botón “Adjuntar archivos” y subir de nuevo los documentos necesarios.
                  </p>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button className='btn-aceptar' onClick={Enviar} variant={"contained"} sx={{ mr: 1 }}>Continuar</Button>

                    <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"}>Cancelar</Button>

                  </Box>
                </center>
              </Box>
            </DialogContent>
          </Grid>
        </Grid>
      </Dialog>
    </div >
  );
};
export default AlertaEnviarCotizacion;
