import { Route, Routes } from "react-router-dom";
//importamos las rutas de navegacion creadas en el archivo global que creamos
import { LOGIN } from '../Constants/NavegacionRoutes';
import Login from '../Views/Login/Login';

const RoutesPublicas = ({ AlltubLogo, setMessageSnackBar, setCloseLoadingScreen, setOpenLoadingScreen, setMsjLoadingScreen }) => {

  return (
    <>
      {/* Coincidirá con un conjunto de rutas secundarias desde la ubicación actual */}
      <Routes>
        {/* Ruta en la que se navegará, el path recibe la ruta del archivo global (NavegacionRoutes) y en element recibe 
                el componente a mostrar */}
        <Route
          path={LOGIN}
          element={
            <Login
              setOpenLoadingScreen={setOpenLoadingScreen}
              setCloseLoadingScreen={setCloseLoadingScreen}
              setMessageSnackBar={setMessageSnackBar}
              setMsjLoadingScreen={setMsjLoadingScreen}

              AlltubLogo={AlltubLogo}
            />
          }
        />
      </Routes>

    </>
  );
};

export default RoutesPublicas;
