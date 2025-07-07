import { Box, Button, Collapse, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from 'react';
import { NavLink } from "react-router-dom";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import LogoutIcon from '@mui/icons-material/Logout';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { CATALOGOS, CONTEO, HOME, SOLICITUD, USUARIOS, ROLES } from "../../Constants/NavegacionRoutes";
import { useStepSetContext } from '../../hooks/StepProvider';
import { useUserContenidoContext } from "../../hooks/UserConteProvider";

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function NavListDrawer(props) {
    //:::::::::::::::::::::: step :::::::::::::::::::::::
    const setStep = useStepSetContext();

    const handleStep = (step) => {
        setStep(step)
        props.setOpen(false)
    }

    const cerrarMenu = () => {
        props.setOpen(false)
    }
    //:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::
    const user = useUserContenidoContext();
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
        setOpenCatalogo(false);
    };

    const [openCatalogo, setOpenCatalogo] = useState(false);
    const handleClickCatalogo = () => {
        setOpenCatalogo(!openCatalogo);
        setOpen(false);
    };

    const MyComponent = () => {
        return <img width={'220'} height={'100%'} src={props.props.AlltubLogo} />
    }

    const navCatalogos = [
        //{ title: "Almacén", icon: <InfoIcon />, handleTab: handleStep, tabNum: 0 },
        { title: "Productos", icon: <InfoIcon />, handleTab: handleStep, tabNum: 1 },
        { title: "Unidad de Medida", icon: <InfoIcon />, handleTab: handleStep, tabNum: 2 },
        { title: "Grupo de Artículos", icon: <InfoIcon />, handleTab: handleStep, tabNum: 3 },
        { title: "Moneda", icon: <InfoIcon />, handleTab: handleStep, tabNum: 4 },
        { title: "Tipo", icon: <InfoIcon />, handleTab: handleStep, tabNum: 5 },
        { title: "Categoría", icon: <InfoIcon />, handleTab: handleStep, tabNum: 6 },
        { title: "Departamento", icon: <InfoIcon />, handleTab: handleStep, tabNum: 7 },
        //{ title: "Roles", icon: <InfoIcon />, handleTab: handleStep, tabNum: 5 },
        //{ title: "Ubicación", icon: <InfoIcon />, handleTab: handleStep, tabNum: 5 },
        //{ title: "Centro", icon: <InfoIcon />, handleTab: handleStep, tabNum: 7 },
    ]


    return (
        <Box sx={{ width: 250 }}>
            <center>
                <Box
                    sx={{ display: { xs: "none", sm: "block" }, background: user.ColorBannerMenu }}>
                    <Button component={NavLink} to={HOME}>
                        <MyComponent />
                    </Button>
                </Box>
                <h3>{user.nombre} ({user.nameRol})</h3>
                <Divider />
            </center>
            <Divider />
            <nav>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={NavLink}
                            to={HOME}
                            onClick={cerrarMenu}
                        >
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText >Inicio</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </List>
            </nav>
            <Box sx={{ flexGrow: 1 }}>
                <nav>
                    <List >
                        <ListItem disablePadding>
                            <ListItemButton
                                component={NavLink}
                                to={SOLICITUD}
                                onClick={cerrarMenu}
                            >
                                <ListItemIcon>
                                    <LibraryBooksIcon />
                                </ListItemIcon>
                                <ListItemText >Solicitud</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
            </Box>
            {user.idRol == 1 && (
                <>
                    {/* <Box sx={{ flexGrow: 1 }}>
                        <nav>
                            <List >
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={NavLink}
                                        to={ALMACEN}
                                    >
                                        <ListItemIcon>
                                            <PeopleAltIcon />
                                        </ListItemIcon>
                                        <ListItemText >Carga Almacen</ListItemText>
                                    </ListItemButton>
                                </ListItem>

                            </List>
                        </nav>
                    </Box> */}
                    <Box sx={{ flexGrow: 1 }}>
                        <nav>
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={NavLink}
                                        to={USUARIOS}
                                        onClick={cerrarMenu}
                                    >
                                        <ListItemIcon>
                                            <PeopleAltIcon />
                                        </ListItemIcon>
                                        <ListItemText >Usuarios</ListItemText>
                                    </ListItemButton>
                                </ListItem>

                            </List>
                        </nav>
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        <nav>
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        component={NavLink}
                                        to={ROLES}
                                        onClick={cerrarMenu}
                                    >
                                        <ListItemIcon>
                                            <ManageAccountsIcon />
                                        </ListItemIcon>
                                        <ListItemText >Roles</ListItemText>
                                    </ListItemButton>
                                </ListItem>

                            </List>
                        </nav>
                    </Box>
                    <List>
                        <Box>
                            <ListItemButton onClick={handleClickCatalogo}>
                                <ListItemIcon>
                                    <ViewModuleIcon />
                                </ListItemIcon>
                                <ListItemText primary={'Catálogos'} />
                                {openCatalogo ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={openCatalogo} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        navCatalogos.map(item => (
                                            <ListItemButton sx={{ pl: 4 }} component={NavLink} to={CATALOGOS} onClick={(e) => item.handleTab(item.tabNum)}>
                                                <ListItemIcon>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={item.title} />
                                            </ListItemButton>
                                        ))}
                                </List>
                            </Collapse>
                        </Box>
                    </List>
                </>
            )}
            
            <Box>
                <List>
                    <ListItemButton onClick={handleClick}>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={user.user} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }} onClick={props.log_Out}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Cerrar Sesión" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Box>
    )
}

