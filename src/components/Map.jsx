import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";

function Map() {
    const [mapPosition, setMapPosition] = useState([40, 0]);
    const { cities } = useCities();
    const [searchParams] = useSearchParams();
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
    } = useGeolocation();

    const mapLat = searchParams.get("lat");
    const mapLng = searchParams.get("lng");

    useEffect(
        function () {
            if (mapLat && mapLng) {
                setMapPosition([mapLat, mapLng]);
            }
        },
        [mapLat, mapLng]
    );

    useEffect(
        function () {
            if (geolocationPosition) {
                setMapPosition([
                    geolocationPosition.lat,
                    geolocationPosition.lng,
                ]);
            }
        },
        [geolocationPosition]
    );

    return (
        <div className={styles.mapContainer}>
            {!geolocationPosition && (
                <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? "Loading ..." : "Use your position"}
                </Button>
            )}
            <MapContainer
                center={mapPosition}
                zoom={6}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker
                        key={city.id}
                        position={[city.position.lat, city.position.lng]}
                    >
                        <Popup>
                            <span>{city.emoji}</span> <span>{city.notes}</span>
                        </Popup>
                    </Marker>
                ))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

ChangeCenter.propTypes = {
    position: PropTypes.array,
};

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: (event) => {
            const queryParams = `?lat=${event.latlng.lat}&lng=${event.latlng.lng}`;
            navigate("form" + queryParams);
        },
    });
}

export default Map;
