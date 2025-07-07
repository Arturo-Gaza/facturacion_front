import { Dialog, DialogContent, Grid } from '@mui/material';
//REACT
import { useEffect, useState } from 'react';
//COMPONENTES MUI MATERIAL
import {
    Box,
    IconButton
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
//ACCIONES
//ICONOS 
//ESTILOS
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { StyledTableCell } from '../Styles/Table/Table';

const campos = [
    { label: 'Almacén', key: 'id' },
    { label: 'Material', key: 'id_usuario' },
    { label: 'Descripción', key: 'prioridad' },
    { label: 'UME', key: 'id_unidad_medida' },
    { label: 'Grupo de artículos', key: 'descripcion_solicitud' },
    { label: 'Libre utilización', key: 'justificacion_solicitud' },
    { label: 'En control calidad', key: 'cantidad' },
    { label: 'Bloqueado', key: 'id_estatus_solicitud' },
    { label: 'Valor libre util.', key: 'fecha_solicitud' },
    { label: 'Valor en insp.cal.', key: 'id_tipo' },
    { label: 'Valor stock bloq.', key: 'id_categoria' },
    { label: 'Cantidad total (SAP)', key: 'id_grupo_articulo' },
    { label: 'Importe unitario', key: 'descripcion_requerimiento' },
    { label: 'Importe total', key: 'marca' },
    { label: 'Importe total', key: 'modelo' },
    { label: 'Importe total', key: 'observaciones' },
    { label: 'Importe total', key: 'archivo_adjunto' },
    { label: 'Importe total', key: 'created_at' },
    { label: 'Importe total', key: 'updated_at' },
];

const AlertaVisualizar = ({ solicitudInfo, open, close }) => {
    const [fullWidth, setFullWidth] = useState(true);
    const [maxWidth, setMaxWidth] = useState('sm');
    const [formData, setFormData] = useState([solicitudInfo] || []);

    useEffect(() => {
        setFormData([solicitudInfo]);
    }, [solicitudInfo]);

    const Cancelar = () => {
        close(false);
    };
    return (
        <div>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
            >
                <Grid>
                    <Grid container className='containerCerrar'>
                        <a className='cerrar'>
                            <IconButton aria-label="delete" size="small"
                                onClick={Cancelar}

                            >
                                <DisabledByDefaultIcon sx={{ color: 'red' }} />
                            </IconButton>
                        </a>
                    </Grid>
                    <DialogContent>
                        <Box
                            sx={{
                                height: '400px', // Altura fija, puedes ajustar
                                overflowY: 'auto', // Scroll vertical
                                paddingRight: '16px' // Opcional: para evitar que el scroll tape el contenido
                            }}>

                            <center>
                                <h3>Detalle Solicitud</h3>

                                <Table>
                                    <TableBody>
                                        {campos.map((campo) => (
                                            <TableRow key={campo.key}>
                                                <StyledTableCell><h3>{campo.label}</h3></StyledTableCell>
                                                {formData.map((registro, index) => (
                                                    <StyledTableCell key={index}>
                                                        <h3> {registro?.[campo.key] ?? "-"}</h3>
                                                    </StyledTableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </center>
                        </Box>
                    </DialogContent>
                </Grid>

            </Dialog>
        </div >

    )
}
export default AlertaVisualizar


// < TableContainer component = { Paper } >
//     <Table>
//         <TableBody>
//             {campos.map((campo) => (
//                 <TableRow key={campo.key}>
//                     <StyledTableCell sx={{ fontWeight: 'bold' }}>{campo.label}</StyledTableCell>
//                     <StyledTableCell>{datosEstaticos[campo.key]}</StyledTableCell>
//                 </TableRow>
//             ))}
//         </TableBody>
//     </Table>
//         </TableContainer >
