"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Input } from "../input";

// Define libraries outside of the component
const libraries = ["places"];

export default function GooglePlacesAPI({
  setSelectedPlace,
  is_google_configured = null,
}) {
  const options = useMemo(
    () => ({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      libraries: libraries,
    }),
    []
  );

  const { isLoaded, loadError } = useLoadScript(options);

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps data...</div>;
  return (
    <PlacesAutocomplete
      setSelected={setSelectedPlace}
      is_google_configured={is_google_configured}
    />
  );
}

const PlacesAutocomplete = ({ setSelected, is_google_configured }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  useEffect(() => {
    if (showSuggestions && suggestionsRef.current) {
      suggestionsRef.current.focus();
    }
  }, [showSuggestions]);

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    setShowSuggestions(false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const place_id = results[0].place_id;

      setSelected({ lat, lng, place_id });
      console.log("Selected Place: ", { lat, lng, place_id });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < data.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter" && activeIndex !== -1) {
      handleSelect(data[activeIndex].description);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowSuggestions(true);
          setActiveIndex(-1);
        }}
        disabled={!ready}
        placeholder={`${
          is_google_configured === null
            ? "Type your business name and address"
            : "Type new business name and address"
        }`}
        className="w-full p-2 border border-stone-300 rounded-md placeholder:text-sm placeholder:text-stone-500 text-sm"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && status === "OK" && (
        <ul
          id="suggestions-list"
          className="absolute z-[9999999] w-full bg-white shadow-lg rounded-md mt-1 text-sm"
          role="listbox"
          ref={suggestionsRef}
          tabIndex="-1"
        >
          {data.map(({ place_id, description }, index) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`p-2 cursor-pointer transition-colors duration-150 ${
                index === activeIndex ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
              role="option"
              aria-selected={index === activeIndex}
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
