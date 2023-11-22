import React from "react";
import {Register} from '../PageComponents/Register'; // Import the Registration component

const RegistrationPage = () => {
  const handleFormSwitch = (formType) => {
    console.log(`Switching to ${formType} form`);
  };

  return (
    <div>
      <Register onFormSwitch={handleFormSwitch} /> {/* Render the Registration component here */}
    </div>
  );
};

export default RegistrationPage;