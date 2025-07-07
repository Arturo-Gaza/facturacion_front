import { Box, Button, Dialog, DialogContent, Grid } from "@mui/material";
import { useState } from "react";
import { useUserContenidoContext } from "../hooks/UserConteProvider";
import {
  UPDATE_ESTATUS_SOLICITUDES,
  CREATE_OBSERVACIONES_SOLICITUD,
} from "../Constants/ApiConstants";
import requests from "../components/AxiosCalls/AxiosCallsLocal";

const AlertaEnviarCotizacion = (props) => {
  const user = useUserContenidoContext();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xs");
  const [step, setStep] = useState(1);
  const [observacion, setObservacion] = useState("");

  //acciones
  const Enviar = () => {
    props.handleEnviar();
    props.close(false);
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
            maxHeight: "90vh",
            minWidth: "450px",
            maxWidth: "450px",
          },
        }}
      >
        <Grid style={{ borderRadius: "10px" }}>
          <Grid>
            <DialogContent>
              <Box sx={{ padding: 5 }}>
                <center>
                  <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                    Una vez enviado, no podrás realizar cambios. ¿Estás seguro de que deseas continuar?
                  </p>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button className='btn-aceptar' onClick={Enviar} variant={"contained"} sx={{ mr: 1 }}>Enviar</Button>

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
