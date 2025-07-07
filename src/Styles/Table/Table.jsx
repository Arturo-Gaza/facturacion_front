import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useUserContenidoContext } from '../../hooks/UserConteProvider';
//:::::::::::::::::::::: UserConteProvider :::::::::::::::::::::::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::


export const StyledTableCell = styled(TableCell)(({ theme }) => {
    const user = useUserContenidoContext();
    return {
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: user.ColorTable,
            color: 'theme.palette.common.white',
            fontWeight: 'bold',
            fontSize: window.screen.width <= 600 ? 8 : 12,
            border: "1px solid white",
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 8,
            paddingRight: 8,
            lineHeight: 1,
        },
        [`&.${tableCellClasses.body}`]: {
            color: '#545454',
            fontSize: window.screen.width <= 600 ? 8 : 10,
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 8,
            paddingRight: 8,
            lineHeight: 1,
        },
    };
});

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));