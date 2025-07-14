import { Box, Button, Dialog, DialogContent, Grid } from "@mui/material";
import { useState } from "react";
import { useUserContenidoContext } from "../hooks/UserConteProvider";

const AlertBtnCotizar = (props) => {
  const user = useUserContenidoContext();
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState("xs");
  const [step, setStep] = useState(1);
  const [observacion, setObservacion] = useState("");

  //acciones
  const Continuar = async () => {
    props.cambioEstatus();
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
                    Estás a punto de iniciar la cotización de esta solicitud.
                  </p>
                  <p style={{ fontSize: '1rem' }}>
                    Al continuar, el estatus cambiará a <strong>"Cotizando"</strong> y no podrá revertirse.
                    ¿Deseas proceder con la generación de la cotización?
                  </p>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button className='btn-aceptar' onClick={Continuar} variant={"contained"} sx={{ mr: 1 }}>Continuar</Button>

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
export default AlertBtnCotizar;
