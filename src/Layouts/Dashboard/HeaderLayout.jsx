import MenuIcon from "@mui/icons-material/Menu"
import { AppBar, Box, Button, Drawer, IconButton, Toolbar } from '@mui/material'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LOGOUT_USER } from '../../Constants/ApiConstants'
import { HOME } from '../../Constants/NavegacionRoutes'
import requests from '../../components/AxiosCalls/AxiosCallsLocal'
import { useUserContenidoContext } from "../../hooks/UserConteProvider"
import NavListDrawer from './NavListDrawer'


const HeaderLayout = (props) => {
	//:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::
	const user = useUserContenidoContext();
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	const navigate = useNavigate();
	const [open, setOpen] = useState(false)

	const log_Out = () => {
		props.setOpenLoadingScreen()
		requests.getToken(LOGOUT_USER + user.idUsuario)
			.then((response) => {
				props.setMessageSnackBar('Se cerro la sesión correctamente.', 'success');
				localStorage.removeItem("expireTime");
				sessionStorage.clear()
				navigate('/')
				window.location.reload();
				props.setCloseLoadingScreen()
			})
			.catch((error) => {
				props.setMessageSnackBar(error.data.errors, 'error');
				props.setCloseLoadingScreen()
			})
	}

	const MyComponent = () => {
		return <img width={'220'} src={props.AlltubLogo} />
	}

	useEffect(() => {

	}, []);

	return (
		<>
			<AppBar sx={{ position: 'sticky' }} style={{ background: user.ColorBanner }}>
				<Toolbar>

					<IconButton
						color='inherit'
						size='large'
						onClick={() => setOpen(true)}
					>
						<MenuIcon sx={{ color: 'Black', fontSize: '1.5rem' }} />
					</IconButton>
					{/* <Button component={NavLink} to={HOME} sx={{ color: 'white', display: { xs: "block", sm: "block" }, flexGrow: 1 }}> */}
					<Box sx={{ color: 'Black', display: { xs: "block", sm: "block" }, flexGrow: 1 }}>
						<Typography
							variant='h6'
							sx={{ fontWeight: 'bold', fontSize: '0.9rem' }} // puedes ajustar el tamaño aquí
						>
							{user.NombreInst.length <= 1 ? (null) : (user.NombreInst)}
						</Typography>
					</Box>
					{/* </Button> */}

					<Typography variant='h6' sx={{ display: { xs: "none", sm: "block" }, flexGrow: 1 }} >
						{/* mensaje 1 {user.idUsuario} */}
					</Typography>

					<Typography variant='h6' sx={{ display: { xs: "block", sm: "none" }, flexGrow: 1 }} >
						{/* mensaje 2 */}
					</Typography>

					<Box
						sx={{ display: { xs: "none", sm: "block", marginTop: '10px' } }}>
						{/* <Button component={NavLink} to={HOME}> */}
						<MyComponent />
						{/* </Button> */}
					</Box>

				</Toolbar>
			</AppBar>
			<Drawer
				open={open}
				anchor='left'
				onClose={() => setOpen(false)}>
				<NavListDrawer
					setOpen={setOpen}
					log_Out={log_Out}

					props={props}
				/>
			</Drawer>

		</>
	)
}
export default HeaderLayout
