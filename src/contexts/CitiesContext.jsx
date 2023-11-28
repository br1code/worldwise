import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const CitiesContext = createContext();

const API_URL = "http://localhost:9000";

CitiesProvider.propTypes = {
    children: PropTypes.any,
};

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchCities() {
            try {
                setIsLoading(true);
                const res = await fetch(`${API_URL}/cities`);

                if (!res.ok) {
                    throw new Error("Failed to fetch cities");
                }

                const data = await res.json();
                setCities(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCities();
    }, []);
    return (
        <CitiesContext.Provider value={{ cities, isLoading }}>
            {children}
        </CitiesContext.Provider>
    );
}

function useCities() {
    const context = useContext(CitiesContext);

    if (context === undefined) {
        throw new Error(
            "Attempted to use CitiesContext outside of its provider"
        );
    }

    return context;
}

export { CitiesProvider, useCities };
