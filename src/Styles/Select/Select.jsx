import { MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';

//::ESTILOS GENERALES::
export const SelectGeneral = styled((props) => (
	<Select
		disabled={props.idprops != null || props.idprops != undefined ? true : false}
		fullWidth
		required
		size="small"
		sx={{
			textAlign: 'left', // Alinear el texto a la izquierda
			'& .MuiSelect-select': {
				padding: '10px', // Agregar padding para que el texto no se pegue a los bordes
			},

			fontSize: 16,
			height: '32px',
		}}
		{...props}
	/>
))(({ theme }) => ({}));

export const MenuItemGeneral = styled((props) => (
	<MenuItem
		sx={{
			borderColor: 'rgba(243, 116, 51, 0.30) ',
			fontSize: 15,
			color: '#004080',
			gridTemplateColumns: 'repeat(3, 100px)',
			gridAutoRows: '100px',
			gap: 1,
			'&:hover': {
				backgroundColor: 'rgba(0, 102, 204, 0.60)',
				color: 'white'
			},
			fontFamily: 'Arial',
		}}
		{...props}
	/>
))(({ theme }) => ({}));

// ::::::::::::::::::::::::::::NUEVO FILTRO ::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export const SelectFiltro = styled((props) => (
	<Select
		fullWidth
		required
		size="small"
		sx={{
			fontSize: 16,
			height: '32px',
		}}
		{...props}
	/>
))(({ theme }) => ({}));

export const MenuItemFiltro = styled((props) => (
	<MenuItem
		sx={{
			borderColor: 'rgba(243, 116, 51, 0.30) ',
			fontSize: 15,
			color: '#004080',
			gridTemplateColumns: 'repeat(3, 100px)',
			gridAutoRows: '100px',
			gap: 1,
			'&:hover': {
				backgroundColor: 'rgba(0, 102, 204, 0.60)',
				color: 'white'
			},
			fontFamily: 'Arial',
		}}
		{...props}
	/>
))(({ theme }) => ({}));





// export const StyledMenu = styled(InputBase)(({ theme }) => ({
// 	'label + &': {
// 		marginTop: theme.spacing(3),
// 	},
// 	'& .MuiInputBase-input': {
// 		color: '#004080',
// 		borderRadius: 4,
// 		position: 'relative',
// 		//backgroundColor: theme.palette.background.paper,
// 		border: '3px solid rgba(243, 116, 51, 0.30)',
// 		fontSize: 15,
// 		transition: theme.transitions.create(['border-color', 'box-shadow']),
// 		// Use the system font instead of the default Roboto font.
// 		fontFamily: [
// 			'-apple-system',
// 			'BlinkMacSystemFont',
// 			'"Segoe UI"',
// 			'Roboto',
// 			'"Helvetica Neue"',
// 			'Arial',
// 			'sans-serif',
// 			'"Apple Color Emoji"',
// 			'"Segoe UI Emoji"',
// 			'"Segoe UI Symbol"',
// 		].join(','),
// 		'&:focus': {
// 			borderRadius: 4,
// 			borderColor: '#80bdff',
// 			boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
// 		},
// 	},
// }));