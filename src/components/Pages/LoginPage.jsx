import React from "react";
import {Login} from '../PageComponents/Login'; // Imports existing Login component

const LoginPage = () => {
  const handleFormSwitch = (formType) =>{
    console.log(`Switching to ${formType} form`)
  }
  return (
    <div>
      <Login onFormSwitch = {handleFormSwitch} /> {/* Renders existing Login component here */}
    </div>
  );
};

export default LoginPage;