import { Navigate, Outlet } from "react-router-dom";
export const ProtectedRouteRolAdministrador = ({ canActivate, redirectPath = "/" }) => {
    const user = canActivate;
    return user == 1 ? <Outlet /> : <Navigate to={redirectPath} replace />
};

export const ProtectedRouteRolAlmacen = ({ canActivate, redirectPath = "/" }) => {
    const user = canActivate;
    return user == 2 ? <Outlet /> : <Navigate to={redirectPath} replace />
};


