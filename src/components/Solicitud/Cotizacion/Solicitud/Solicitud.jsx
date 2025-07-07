import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '../HeaderSolicitud/Header';

const Solicitud = ({ setMessageSnackBar, setCloseLoadingScreen, setOpenLoadingScreen, setMsjLoadingScreen, id }) => {
    const [_id, setId] = useState(null);

    useEffect(() => {
        setId(id)
    }, [id]);

    const navigate = useNavigate();
    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Box sx={{ border: '1px solid #ccc', borderRadius: 2, padding: 2, maxWidth: '90%' }}>

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