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
    const [currentCity, setCurrentCity] = useState({});

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

    async function getCity(id) {
        try {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/cities/${id}`);

            if (!res.ok) {
                throw new Error("Failed to fetch cities");
            }

            const data = await res.json();
            setCurrentCity(data);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function createCity(newCity) {
        try {
            setIsLoading(true);

            const body = JSON.stringify(newCity);
            const res = await fetch(`${API_URL}/cities`, {
                method: "POST",
                body,
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                throw new Error("Failed to create city");
            }

            const data = await res.json();

            // adding new city to local state manually because we are not re-fetching the cities yet
            setCities((cities) => [...cities, data]);
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function removeCity(id) {
        try {
            setIsLoading(true);

            const res = await fetch(`${API_URL}/cities/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to remove city");
            }

            // removing city from local state manually because we are not re-fetching the cities yet
            setCities((cities) => cities.filter((city) => city.id !== id));
        } catch (error) {
            console.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                getCity,
                createCity,
                removeCity,
            }}
        >
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
