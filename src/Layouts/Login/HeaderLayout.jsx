import { AppBar, Toolbar, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { useNavigate } from 'react-router-dom'
import { LOGIN } from '../../Constants/NavegacionRoutes'
import { useUserContenidoContext } from '../../hooks/UserConteProvider'
import Theme from '../../Styles/Theme'


const useStyles = makeStyles(theme => ({
	offset: theme.mixins.Toolbar,
	title: {
		flexGrow: 1
	}
}))

const HeaderLayout = (props) => {
	//:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::
	const user = useUserContenidoContext();
	//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	let navigate = useNavigate()

	const login = () => {
		navigate(LOGIN)
	}
	const classes = useStyles()
	return (

		<div >
			<ThemeProvider theme={Theme}>
				<AppBar style={{ background: user.ColorBanner }}>
					<Toolbar>

						<Typography variant='h6' color={'black'} className={classes.title}>
							SISTEMA DE TICKETS PARA SOLICITUD DE COTIZACIONES DE COMPRAS
						</Typography>
						{/* <Button variant='text' style={{ color: "white" }} onClick={login}>
							Iniciar sesión
						</Button> */}
					</Toolbar>
				</AppBar>
				<div className={classes.offset}></div>
			</ThemeProvider>
		</div >

	)
}
export default HeaderLayout

