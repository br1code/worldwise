import PropTypes from "prop-types";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";

CityItem.propTypes = {
    city: PropTypes.object,
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

function CityItem({ city }) {
    const { currentCity, removeCity } = useCities();
    const { id, cityName, emoji, date, position } = city;
    const linkUrl = `${id}?lat=${position.lat}&lng=${position.lng}`;

    const isCurrenctCitySelected = currentCity.id === id;
    const className = `${styles.cityItem} ${
        isCurrenctCitySelected ? styles["cityItem--active"] : ""
    }`;

    async function handleRemoveCity(event) {
        event.preventDefault();
        removeCity(id);
    }

    return (
        <li>
            <Link to={linkUrl} className={className}>
                <span className={styles.emoji}>{emoji}</span>
                <h3 className={styles.name}>{cityName}</h3>
                <time className={styles.date}>({formatDate(date)})</time>
                <button className={styles.deleteBtn} onClick={handleRemoveCity}>
                    &times;
                </button>
            </Link>
        </li>
    );
}

export default CityItem;
