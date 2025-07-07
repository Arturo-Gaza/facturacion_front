import { useUserContenidoContext } from '../../hooks/UserConteProvider';

const Dashboard = ({ setMessageSnackBar, setCloseLoadingScreen, setOpenLoadingScreen, setMsjLoadingScreen }) => {
    const user = useUserContenidoContext();

    return (
        <div>
            <center>
                <h1>
                    Dashboard
                </h1>
            </center>
        </div>
    )
}

export default Dashboard