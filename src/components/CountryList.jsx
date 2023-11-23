import PropTypes from "prop-types";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";

CountryList.propTypes = {
    cities: PropTypes.array,
    isLoading: PropTypes.bool,
};

function CountryList({ cities, isLoading }) {
    if (isLoading) {
        return <Spinner />;
    }

    if (!cities || !cities.length) {
        return (
            <Message message="Add your first city by clicking on a city on the map" />
        );
    }

    const countries = cities.reduce((acc, city) => {
        const existingCountry = acc.find((c) => c.name === city.country);
        if (!existingCountry) {
            acc.push({ name: city.country, emoji: city.emoji });
        }
        return acc;
    }, []);

    return (
        <ul className={styles.countryList}>
            {countries &&
                countries.map((country) => (
                    <CountryItem key={country.id} country={country} />
                ))}
        </ul>
    );
}

export default CountryList;
