import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
    const navigate = useNavigate();

    function handleOnClickButton(event) {
        event.preventDefault();
        navigate(-1);
    }

    return (
        <Button type="back" onClick={handleOnClickButton}>
            &larr; Back
        </Button>
    );
}

export default BackButton;
