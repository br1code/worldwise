import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useReducer,
} from "react";
import PropTypes from "prop-types";

const CitiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
};

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return { ...state, isLoading: true };

        case "cities/loaded":
            return { ...state, isLoading: false, cities: action.payload };

        case "city/loaded":
            return { ...state, isLoading: false, currentCity: action.payload };

        case "city/created":
            return {
                ...state,
                isLoading: false,
                // adding new city to local state manually because we are not re-fetching the cities yet
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
            };

        case "city/deleted":
            return {
                ...state,
                isLoading: false,
                // removing city from local state manually because we are not re-fetching the cities yet
                cities: state.cities.filter(
                    (city) => city.id !== action.payload
                ),
                currentCity: {},
            };

        case "rejected":
            return { ...state, isLoading: false, error: action.payload };

        default:
            throw new Error("Unknown action type");
    }
}

const API_URL = "http://localhost:9000";

CitiesProvider.propTypes = {
    children: PropTypes.any,
};

function CitiesProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { cities, isLoading, currentCity, error } = state;

    useEffect(() => {
        async function fetchCities() {
            try {
                dispatch({ type: "loading" });
                const res = await fetch(`${API_URL}/cities`);

                if (!res.ok) {
                    throw new Error("Failed to fetch cities");
                }

                const data = await res.json();
                dispatch({ type: "cities/loaded", payload: data });
            } catch (error) {
                dispatch({ type: "rejected", payload: error.message });
            }
        }

        fetchCities();
    }, []);

    const getCity = useCallback(
        async function getCity(id) {
            // avoid fetching current city
            if (Number(id) === currentCity.id) {
                return;
            }

            try {
                dispatch({ type: "loading" });
                const res = await fetch(`${API_URL}/cities/${id}`);

                if (!res.ok) {
                    throw new Error("Failed to fetch city");
                }

                const data = await res.json();
                dispatch({ type: "city/loaded", payload: data });
            } catch (error) {
                dispatch({ type: "rejected", payload: error.message });
            }
        },
        [currentCity.id]
    );

    async function createCity(newCity) {
        try {
            dispatch({ type: "loading" });

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
            dispatch({ type: "city/created", payload: data });
        } catch (error) {
            dispatch({ type: "rejected", payload: error.message });
        }
    }

    async function removeCity(id) {
        try {
            dispatch({ type: "loading" });

            const res = await fetch(`${API_URL}/cities/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                throw new Error("Failed to remove city");
            }

            dispatch({ type: "city/deleted", payload: id });
        } catch (error) {
            dispatch({ type: "rejected", payload: error.message });
        }
    }

    return (
        <CitiesContext.Provider
            value={{
                isLoading,
                error,
                cities,
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
