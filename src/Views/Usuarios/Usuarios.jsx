import { useNavigate } from 'react-router-dom';
import Tabs1 from '../../components/Usuarios/Views/1_Usuarios';

const HomeView = (props) => {
    const navigate = useNavigate();

    return (
        <div>
            <p className='p3' style={{ fontWeight: '500' }}>
                <Tabs1 props={props} />
            </p>
        </div>
    )
}

export default HomeView