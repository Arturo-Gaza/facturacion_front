import { Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useUserContenidoContext } from '../../hooks/UserConteProvider';



export const TituloBanner = styled((props) => ( //<-------------- PUEDO RECIBIR UN PROPS PARA HABILITADO O DESHABILITADO
    <Typography variant="h5" gutterBottom />

))(({ theme }) => ({}));

export const Titulo = (({ theme }) => {
    const user = useUserContenidoContext();
    return (
        <Typography variant="h6" gutterBottom>
            h1. Heading
        </Typography>
    )
})

export const SubTitulo = (({ theme }) => {
    const user = useUserContenidoContext();
    return (
        <Typography variant="subtitle1" gutterBottom>
            h1. Heading
        </Typography>
    )
})

export const TituloTable = (({ theme }) => {
    const user = useUserContenidoContext();
    return (
        <Typography variant="subtitle2" gutterBottom>
            h1. Heading
        </Typography>
    )
})

export const TextTable = (({ theme }) => {
    const user = useUserContenidoContext();
    return (
        <Typography variant="body1" gutterBottom>
            h1. Heading
        </Typography>
    )
})