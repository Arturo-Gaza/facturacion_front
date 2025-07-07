import { Box, Button, Dialog, DialogContent, Grid } from "@mui/material";
import { useState } from "react";
import { useUserContenidoContext } from "../hooks/UserConteProvider";
import {
  UPDATE_ESTATUS_SOLICITUDES,
  CREATE_OBSERVACIONES_SOLICITUD,
} from "../Constants/ApiConstants";
import requests from "../components/AxiosCalls/AxiosCallsLocal";

const AlertaCerrarSolicitud = (props) => {
  const user = useUserContenidoContext();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xs");
  const [step, setStep] = useState(1);
  const [observacion, setObservacion] = useState("");

  //acciones
  const ContinuarSig = () => {
    setStep(2);
  };

  const Cancelar = () => {
    props.close(false);
    setStep(1);
  };

  const Continuar = () => {
    if (observacion.trim() === "") {
      props.props.props.setMessageSnackBar(
        "Agregue una observación.",
        "warning"
      );
      return;
    }

    const dataObservacion = {
      id_solicitud: props.solicitudItem.id,
      observacion: 'Motivo de cancelación: ' + observacion,
      id_usuario: user.idUsuario,
    };

    props.props.props.setOpenLoadingScreen();

    requests
      .postToken(CREATE_OBSERVACIONES_SOLICITUD, dataObservacion)
      .then(() => {
        CambioEstatus(3, props.solicitudItem.id);
        setStep(1);
      })
      .catch((error) => {
        props.props.props.setMessageSnackBar(
          "Error al guardar observación",
          "error"
        );
        props.props.props.setCloseLoadingScreen();
      });
  };

  const CambioEstatus = (IdStatus, idSolicitud) => {
    let data = {
      id_estatus: IdStatus,
      id_solicitud: idSolicitud,
    };
    props.props.props.setOpenLoadingScreen();
    requests
      .postToken(UPDATE_ESTATUS_SOLICITUDES, data) //### **
      .then((response) => {
        Cancelar();
        props.GetListCatalogo();
      })
      .catch((error) => {
        props.props.props.setMessageSnackBar(error, "warning");
        props.props.props.setCloseLoadingScreen();
      });
  };

  return (
    <div>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={props.open}>
        <Grid style={{ borderRadius: "10px" }}>
          <Grid>
            <DialogContent>
              {step === 1 && (
                <center>
                  <p style={{ fontWeight: "700", fontSize: "1.2rem" }}>
                    ¿Quieres cancelar el ticket?
                  </p>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button className="btn-aceptar" onClick={ContinuarSig} variant={"contained"} sx={{ mr: 1 }}>
                      Continuar
                    </Button>

                    <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"} >
                      Cancelar
                    </Button>
                  </Box>
                </center>
              )}
              {step === 2 && (
                <center>
                  <p style={{ fontWeight: "700", fontSize: "1.2rem" }}>
                    ¿Estás seguro de que deseas cancelar el ticket? <br />
                    Ingresa un motivo de cancelación
                  </p>
                  <textarea
                    cols="50"
                    rows="4"
                    id="observacion"
                    name="observacion"
                    placeholder="Escribe aquí tu Observación"
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                  ></textarea>

                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"} sx={{ mr: 1 }}>
                      Cancelar
                    </Button>

                    <Button className="btn-aceptar" onClick={Continuar} variant={"contained"} sx={{ mr: 1 }} >
                      Continuar
                    </Button>

                  </Box>
                </center>
              )}
            </DialogContent>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};
export default AlertaCerrarSolicitud;
