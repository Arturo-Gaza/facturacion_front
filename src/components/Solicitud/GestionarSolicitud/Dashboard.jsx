import Admin from '../../Views/CargaAlmacen/CargaAlmacen';
import Almacen from '../../Views/Conteo/Conteo';

const HomeView = ({ setMessageSnackBar, setCloseLoadingScreen, setOpenLoadingScreen, setMsjLoadingScreen }) => {
    return (
        <div>
            {user.idRol == 1 && (<Admin
                setOpenLoadingScreen={setOpenLoadingScreen}
                setCloseLoadingScreen={setCloseLoadingScreen}
                setMessageSnackBar={setMessageSnackBar}
                setMsjLoadingScreen={setMsjLoadingScreen}
            />)}
            {user.idRol == 2 && (<Almacen
                setOpenLoadingScreen={setOpenLoadingScreen}
                setCloseLoadingScreen={setCloseLoadingScreen}
                setMessageSnackBar={setMessageSnackBar}
                setMsjLoadingScreen={setMsjLoadingScreen}
            />)}
        </div>
    )
}

export default HomeView 