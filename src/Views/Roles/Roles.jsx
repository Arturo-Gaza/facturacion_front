import { useNavigate } from 'react-router-dom';
import Tabs3 from '../../components/Catalogos/Views/5_Roles';

const HomeView = (props) => {
    const navigate = useNavigate();

    return (
        <div>
            <p className='p3' style={{ fontWeight: '500' }}>
                <Tabs3 props={props} />
            </p>
        </div>
    )
}

export default HomeView