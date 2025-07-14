
import { useParams } from 'react-router-dom';
import Solicitud from '../../components/Solicitud/GestionarSolicitud/Solicitud/Solicitud';

const EditarSolicitud = ({ setMessageSnackBar, setCloseLoadingScreen, setOpenLoadingScreen, setMsjLoadingScreen }) => {
    const { id } = useParams();
    return (
        <div>
            <Solicitud
                setOpenLoadingScreen={setOpenLoadingScreen}
                setCloseLoadingScreen={setCloseLoadingScreen}
                setMessageSnackBar={setMessageSnackBar}
                setMsjLoadingScreen={setMsjLoadingScreen}
                id={id}
            />
        </div>
    )
}

export default EditarSolicitud