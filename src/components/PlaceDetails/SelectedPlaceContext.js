import React, { createContext, useState } from 'react';

const SelectedPlaceContext = createContext();

const SelectedPlaceProvider = ({ children }) => {
  const [selectedPlace, setSelectedPlace] = useState('Transport Ticket'); //Setting default place name to transport ticket

  const setPlace = (place) => {
    setSelectedPlace(place);
  };

  return (
    <SelectedPlaceContext.Provider value={{ selectedPlace, setPlace }}>
      {children}
    </SelectedPlaceContext.Provider>
  );
};

export { SelectedPlaceProvider, SelectedPlaceContext };