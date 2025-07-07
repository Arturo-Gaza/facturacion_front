
import Solicitud from '../../components/Solicitud/GestionarSolicitud/Solicitud/Solicitud';

const CrearSolicitud = ({ setMessageSnackBar, setCloseLoadingScreen, setOpenLoadingScreen, setMsjLoadingScreen }) => {
    return (
        <div>
            <Solicitud
                setOpenLoadingScreen={setOpenLoadingScreen}
                setCloseLoadingScreen={setCloseLoadingScreen}
                setMessageSnackBar={setMessageSnackBar}
                setMsjLoadingScreen={setMsjLoadingScreen}
                id={null}
            />
        </div>
    )
}

export default CrearSolicitud