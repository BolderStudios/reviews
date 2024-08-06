"use client";

import { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
} from "@reach/combobox";

export default function GooglePlacesAPI({ setSelectedPlace }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;

  return <PlacesAutocomplete setSelected={setSelectedPlace} />;
}

const PlacesAutocomplete = ({ setSelected }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    setShowSuggestions(false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const place_id = results[0].place_id;

      setSelected({ lat, lng, place_id });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="relative">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowSuggestions(true);
          }}
          disabled={!ready}
          placeholder="Search an address"
          className="w-full p-2 border border-stone-300 rounded-md"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
      </Combobox>
      {showSuggestions && status === "OK" && (
        <div className="absolute z-[9999999] w-full bg-white shadow-lg rounded-md mt-1">
          <ul>
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="p-2 cursor-pointer transition-colors duration-150 hover:bg-gray-200"
              >
                {description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};