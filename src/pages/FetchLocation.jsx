import { useState } from "react"

const FetchLocation = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null })
    const [address, setAddress] = useState({ state: "", city: "", district: "" })
    const [error, setError] = useState("")

    const fetchGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, handleError)
        } else {
            setError("Geolocation is not supported by this browser")
        }
    }

    const success = async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setLocation({ latitude, longitude })
        await fetchAddress(latitude, longitude)
    }

    const handleError = () => {
        setError("Unable to fetch your location")
    }

    const fetchAddress = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            // console.log(data)

            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state;
            const district = data.address.county || data.address.suburb;

            setAddress({ city, state, district });
        } catch (err) {
            setError("Error fetching address information.");
            console.error(err);
        }
    }

    return (
        <div>
            {/* <button onClick={fetchGeoLocation}>
                fetch location
            </button> */}

            {location.latitude && location.longitude && (
                <div>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}

            {address.city && (
                <div>
                    <p>City: {address.city}</p>
                    <p>State: {address.state}</p>
                    <p>District: {address.district}</p>
                </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default FetchLocation
