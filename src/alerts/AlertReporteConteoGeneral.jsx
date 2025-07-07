import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, TableCell, Tooltip, Typography } from '@mui/material';
//REACT
import React, { useState } from 'react';
//COMPONENTES MUI MATERIAL
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//ACCIONES
import { GET_CONTEOS, GET_NUM_CONTEOS_BY_CARGA } from '../Constants/ApiConstants';
import requests from '../components/AxiosCalls/AxiosCallsLocal';
//ICONOS 
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import moment from 'moment';
import * as XLSX from 'xlsx';
import { MenuItemGeneral, SelectGeneral } from '../Styles/Select/Select';
import { StyledTableCell, StyledTableRow } from '../Styles/Table/Table';


const AlertReporteConteoGeneral = (props) => {

  const [_ListReporte, setListReporte] = useState([])
  const GetListReporte = (idCarga, numConteo) => {
    props.props.props.props.setOpenLoadingScreen()
    requests
      .getToken(GET_CONTEOS + idCarga + '/' + numConteo)
      .then((response) => {
        const groupedByProducto = response.data.data.original.reduce(
          (result, producto) => {
            const { clave_producto, descripcion_producto_material, ubicacion, cantidad } = producto;

            if (!result[clave_producto]) {
              result[clave_producto] = {
                ubicaciones: {},
                sumaTotalProducto: 0,
                descripcion_producto_material: ''
              };
            }

            if (!result[clave_producto].ubicaciones[ubicacion]) {
              result[clave_producto].ubicaciones[ubicacion] = {
                productos: [],
                sumaTotalUbicacion: 0,
              };
            }



            // Agregar el producto a la lista de productos para esa ubicación
            result[clave_producto].ubicaciones[
              ubicacion
            ].productos.push(producto);

            // Sumar la cantidad para esa ubicación
            result[clave_producto].ubicaciones[ubicacion].sumaTotalUbicacion += cantidad;

            // Sumar la cantidad para ese producto
            result[clave_producto].sumaTotalProducto += cantidad;

            result[clave_producto].descripcion_producto_material = descripcion_producto_material;
            return result;
          },
          {}
        );

        setListReporte(groupedByProducto);
        //setListReporte(response.data.data.original)
        props.props.props.props.setCloseLoadingScreen()
      })
      .catch((error) => {
        error.data.errors.forEach(element => {
          props.props.props.props.setMessageSnackBar(element, 'warning');
        });
        props.props.props.props.setCloseLoadingScreen()
      })
  }

  const [_ListNumConteo, setListNumConteo] = useState([])
  const GetListNumConteo = (idCarga) => {
    props.props.props.props.setOpenLoadingScreen()
    requests
      .getToken(GET_NUM_CONTEOS_BY_CARGA + idCarga) //### ** 
      .then((response) => {
        setListNumConteo(response.data.data.original)
        props.props.props.props.setCloseLoadingScreen()
      })
      .catch((error) => {
        error.data.errors.forEach(element => {
          props.props.props.props.setMessageSnackBar(element, 'warning');
        });
        props.props.props.props.setCloseLoadingScreen()
      })
  }
  const handleAsigConteo = (e) => {
    setNumConteo(e.target.value)
    GetListReporte(props.idCarga, e.target.value);
  }

  const [_numConteo, setNumConteo] = useState(props._numConteo);
  const [_Estatus, setEstatus] = useState(false);
  if (props.open === true && props.idCarga != null && _Estatus === false) {
    setEstatus(true);
    setNumConteo(props._numConteo)
    GetListNumConteo(props.idCarga)
    GetListReporte(props.idCarga, props._numConteo);
  }

  const exportToExcel = () => {
    const worksheetData = [];

    // Recorre cada clave de producto
    Object.keys(_ListReporte).forEach((claveProducto) => {
      worksheetData.push({ Producto: `Producto: ${claveProducto}`, Ubicación: 'Ubicación', Usuario: 'Usuario', Cantidad: 'Cantidad', Observaciones: 'Observaciones' });

      const productoData = _ListReporte[claveProducto];
      // Recorre cada ubicación
      Object.keys(productoData.ubicaciones).forEach((ubicacion) => {
        worksheetData.push({ Producto: '', Ubicación: `Ubicación: ${ubicacion}`, Usuario: '', Cantidad: '', Observaciones: '' });

        const ubicacionData = productoData.ubicaciones[ubicacion];
        // Recorre cada usuario
        ubicacionData.productos.forEach((producto) => {
          worksheetData.push({
            Producto: '',
            Ubicación: '',
            Usuario: producto.usuario_nombre,
            Cantidad: producto.cantidad,
            Observaciones: producto.observaciones
          });
        });

        // Agrega la fila de total por ubicación
        const totalPorUbicacion = ubicacionData.productos.reduce((sum, producto) => sum + producto.cantidad, 0);
        worksheetData.push({
          Producto: '',
          Ubicación: `Total por Ubicación: ${totalPorUbicacion}`,
          Usuario: '',
          Cantidad: ''
        });
      });

      // Agrega la fila de total por producto
      const totalPorProducto = Object.values(productoData.ubicaciones).reduce((sum, ubicacionData) => {
        return sum + ubicacionData.productos.reduce((sumUbi, producto) => sumUbi + producto.cantidad, 0);
      }, 0);
      worksheetData.push({
        Producto: `Total por Producto: ${totalPorProducto}`,
        Ubicación: '',
        Usuario: '',
        Cantidad: ''
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ReporteProductos");
    XLSX.writeFile(workbook, "ReporteProductos.xlsx");
  };

  const exportarExcel = () => {
    const worksheetData = [];

    Object.keys(_ListReporte).forEach((claveProducto) => {
      const productoData = _ListReporte[claveProducto];
      Object.keys(productoData.ubicaciones).forEach((ubicacion) => {
        const ubicacionData = productoData.ubicaciones[ubicacion];
        ubicacionData.productos.forEach((producto) => {
          worksheetData.push({
            "Clave Producto": claveProducto,
            "Descripción Producto": producto.descripcion_producto_material,
            "Ubicación": ubicacion,
            "Usuario": producto.usuario_nombre,
            "Cantidad": producto.cantidad,
            "LOTE": producto.observaciones
          });
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
    const nombreArchivo = `${props.claveCarga}_NoConteo_${_numConteo}_Base_${moment().format("YYYY-MM-DD HH:mm:ss")}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);
  };


  return (
    <div>

      <Grid style={{ borderRadius: "10px" }}>
        <Grid>
          <center>
            <h2>Detalle Base Conteo</h2>
          </center>
          <Grid container>
            <Grid item xs={12} sm={4} md={4} />
            <Grid item xs={12} sm={4} md={4} />

            <Grid item xs={12} sm={4} md={4}>
              <Box
                sx={{
                  display: { xs: "flex", sm: "flex", md: "flex" },
                  justifyContent: {
                    xs: "center",
                    sm: "flex-end",
                    md: "flex-end",
                  },
                }}
              >
                <Tooltip title={"Exportar a Excel"} arrow>
                  <Button
                    //onChange={handleUpload}
                    onClick={exportarExcel}
                    component="label"
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    style={{ width: "2%" }}
                  ></Button>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
          <br></br>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            height={100}
            width={'100%'}
          >
            <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center" colSpan={7}>
                      Encabezado Conteo
                    </StyledTableCell>

                  </TableRow>
                  <TableRow>
                    <StyledTableCell align="center" >
                      <label className='textLabel3'>Clave Carga</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className='textLabel3'>No. Conteo</label>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className='textLabel3'>Emitido el</label>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow
                  >
                    <StyledTableCell align="center">
                      <label className='textLabel4'> {props.claveCarga}</label> {/* //### ** */}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className='textLabel4'> {_numConteo}</label> {/* //### ** */}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <label className='textLabel4'> {moment().format('YYYY-MM-DD HH:mm:ss')}</label> {/* //### ** */}
                    </StyledTableCell>
                  </StyledTableRow>

                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Grid container>
            <Grid item xs={12} sm={4} md={4}>
              <Grid item xs={12} sm={12} md={12} sx={{ paddingBottom: 1 }}>
                <label className="textLabel2">{"Conteos"}</label>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <SelectGeneral
                  // idprops={props.id}
                  id="conteo"
                  name="conteo"
                  value={_numConteo}
                  onChange={handleAsigConteo}
                  className="inputSelectSize25"
                >
                  {_ListNumConteo.map((item) => (
                    <MenuItemGeneral
                      key={item.conteo} // ### **
                      value={item.conteo}
                    >
                      {item.conteo}
                    </MenuItemGeneral>
                  ))}
                </SelectGeneral>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
            </Grid>
            <Grid item xs={12} sm={4} md={4} />

          </Grid>
          <center>
            {Object.keys(_ListReporte).map((claveProducto, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Grid container justifyContent="space-between">
                    <Grid item>
                      <Typography style={{
                        fontWeight: "700",
                        fontSize: "1rem",
                      }}>Producto: {claveProducto} - {_ListReporte[claveProducto].descripcion_producto_material}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography style={{ fontWeight: "700", fontSize: "1rem" }}>
                        Total:{" "}
                        {_ListReporte[claveProducto].sumaTotalProducto}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  {Object.keys(
                    _ListReporte[claveProducto].ubicaciones
                  ).map((ubicacion, locIdx) => (
                    <Accordion key={locIdx}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-${locIdx}-content`}
                        id={`panel${index}-${locIdx}-header`}
                      >
                        <Typography
                          style={{
                            fontWeight: "500",
                            fontSize: "1.2rem",
                          }}
                        >
                          Ubicación: {ubicacion} – Total:{" "}
                          {
                            _ListReporte[claveProducto].ubicaciones[
                              ubicacion
                            ].sumaTotalUbicacion
                          }
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <strong>Usuario</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>Cantidad</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>Observaciones</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {_ListReporte[claveProducto].ubicaciones[
                                ubicacion
                              ].productos.map((producto, prodIndex) => (
                                <TableRow key={prodIndex}>
                                  <TableCell>
                                    {producto.usuario_nombre}
                                  </TableCell>
                                  <TableCell>
                                    {producto.cantidad}
                                  </TableCell>
                                  <TableCell>
                                    {producto.observaciones}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </center>
        </Grid>
      </Grid>
    </div>
  );
}
export default AlertReporteConteoGeneral
