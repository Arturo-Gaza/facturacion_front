import { Box, Button, Dialog, DialogContent, Grid } from "@mui/material";
import React, { useState } from "react";

import requests from "../components/AxiosCalls/AxiosCallsLocal";
import { DELETE_CARGA } from "../Constants/ApiConstants";
import { useUserContenidoContext } from "../hooks/UserConteProvider";
import {
  TextFieldGeneral,
  TextFieldGeneral2,
} from "../Styles/TextField/TextField";

const AlertJustificacionPrioridad = (props) => {
  const user = useUserContenidoContext();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xs");

  const Continuar = () => {
    props.Continuar();
  };

  const Cancelar = () => {
    props.Cancelar();
  };

  return (
    <div>
      <Dialog fullWidth={fullWidth} maxWidth={maxWidth} open={props.open}>
        <Grid style={{ borderRadius: "10px" }}>
          <Grid>
            <DialogContent>
              <center>
                <p style={{ fontWeight: "700", fontSize: "1.2rem" }}>
                  {props.claveCarga}
                  Por favor, proporcione una justificación para asignar esta
                  prioridad
                </p>
                <TextFieldGeneral
                  value={props.solicitudTabla.justificacion_prioridad}
                  className="inputTextSize100"
                  label={"Justificación Prioridad"}
                  placeholder="Escriba una justificación"
                  name={"justificacion_prioridad"}
                  onChange={props.handleSolicitud}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    disabled={props.solicitudTabla.justificacion_prioridad == "" ? true : false}
                    className={props.solicitudTabla.justificacion_prioridad == "" ? "btn-aceptar-disabled" : "btn-aceptar"}
                    onClick={Continuar} variant={"contained"} sx={{ mr: 1 }}>
                    Continuar
                  </Button>

                  <Button className="btn-cancelar" onClick={Cancelar} variant={"contained"} >
                    Cancelar
                  </Button>
                </Box>
              </center>
            </DialogContent>
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
};
export default AlertJustificacionPrioridad;
