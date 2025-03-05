import ErrorMessage from "../errorMessage/errorMessage";
import { useHistory } from "react-router-dom";


const Page404 = () => {

    const history = useHistory();
    const goBack = () => {
        history.goBack();
      };
    return (
        <div>
            <ErrorMessage />
            <p style={{ 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px' }}>Page doesn't exist</p>
            <div onClick={goBack} style={{ 'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px', 'cursor': 'pointer' }} >Go back</div>
        </div>
    )
}

export default Page404;