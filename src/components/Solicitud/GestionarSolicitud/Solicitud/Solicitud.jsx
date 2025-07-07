import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../HeaderSolicitud/Header';
import { useLocation } from 'react-router-dom';

const Solicitud = ({ setMessageSnackBar, setCloseLoadingScreen, setOpenLoadingScreen, setMsjLoadingScreen, id }) => {
    const [_id, setId] = useState(null);

    const location = useLocation();
    const valorDesdeNavegacion = location.state?.habilitarPantalla || 0;
    const [habilitarPantalla, sethabilitarPantalla] = useState(valorDesdeNavegacion);



    useEffect(() => {
        setId(id)
    }, [id, habilitarPantalla]);

    const navigate = useNavigate();
    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Box sx={{ border: '1px solid #ccc', borderRadius: 2, padding: 2, maxWidth: '90%' }}>
                    <center>
                        {_id == null ? (
                            <h2>Crear solicitud</h2>
                        ) : habilitarPantalla === 1 ? (
                            <h2>Observar solicitud</h2>
                        ) : (
                            <h2>Editar solicitud</h2>
                        )}
                    </center>

                    <Header
                        ticket={id}
                        setOpenLoadingScreen={setOpenLoadingScreen}
                        setCloseLoadingScreen={setCloseLoadingScreen}
                        setMessageSnackBar={setMessageSnackBar}
                        setMsjLoadingScreen={setMsjLoadingScreen}
                    />
                </Box>
            </Box>
        </div>
    )
}

export default Solicitud