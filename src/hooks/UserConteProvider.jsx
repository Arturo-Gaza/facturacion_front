import { createContext, useContext, useState } from "react";

const userContenidoContext = createContext();
const userSetContenidoContext = createContext();

export function useUserContenidoContext() {
    return useContext(userContenidoContext);
}

export function useUserSetContenidoContext() {
    return useContext(userSetContenidoContext);
}

export function UserContenidoProvider({ children }) {
    const [_Contenido, setContenido] = useState({
        NombreInst: "",
        ColorBanner: '#B2DB2F',
        ColorBannerMenu: "",
        ColorTable: "",
        ColorSubModulos: "",
        idUsuario: "",
        user: "",
        sesion: "",
        token: "",
        nombre: "",
        idRol: "",
        nameRol: "",
        email: "",
        departamento: "",
        idDepartamento:""
    });

    return (
        <userContenidoContext.Provider value={_Contenido}>
            <userSetContenidoContext.Provider value={setContenido}>
                {children}
            </userSetContenidoContext.Provider>

        </userContenidoContext.Provider>
    );
}