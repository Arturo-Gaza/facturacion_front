import { Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import React from 'react';


import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { MenuItemGeneral, SelectFiltro } from '../Styles/Select/Select';


const AlertaAyuda = (props) => {

    const Salir = () => { // SALIR DE TODOS LOS MODALES
        props.closeFilter();
    }

    const searcher1 = (e) => {
        props.setSearch1(e.target.value);
        props.regresar();
    }

    return (
        <div>
            <Dialog
                open={props.filter}
            >
                <Grid style={{ borderRadius: '10px', width: '300px' }}>
                    <Grid>
                        <Grid container className='containerCerrar'>
                            <a className='cerrar'>
                                <IconButton aria-label="delete" size="small"
                                    onClick={Salir}
                                >
                                    <DisabledByDefaultIcon sx={{ color: 'red' }} />
                                </IconButton>
                            </a>
                        </Grid>
                        <DialogContent >
                            <center>
                                <p style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                    Filtro
                                </p>
                            </center>

                            {props.stepFilter === 1 && (
                                <div>
                                    <p > Estatus </p>

                                    <SelectFiltro
                                        className='inputSelect1'
                                        value={props.search1}
                                        onChange={searcher1}
                                    >

                                        <MenuItemGeneral value={'true'} >
                                            Habilitado
                                        </MenuItemGeneral>
                                        <MenuItemGeneral value={'false'} >
                                            Deshabilitado
                                        </MenuItemGeneral>
                                        <MenuItemGeneral value="Mostrar todos" >
                                            Mostrar todos
                                        </MenuItemGeneral>
                                    </SelectFiltro>
                                </div>
                            )}
                        </DialogContent>
                    </Grid>
                </Grid>
            </Dialog>
        </div>

    )
}
export default AlertaAyuda
