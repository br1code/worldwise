import PropTypes from "prop-types";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

ProtectedRoute.propTypes = {
    children: PropTypes.any,
};

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
}

export default ProtectedRoute;
