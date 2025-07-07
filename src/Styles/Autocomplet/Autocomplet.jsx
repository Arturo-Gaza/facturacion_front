import { Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';

//::ESTILOS GENERALES::
export const AutocompletGeneral = styled((props) => (
	<Autocomplete
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