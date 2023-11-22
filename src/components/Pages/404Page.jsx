import React from 'react'
import FormHeader from './FormStyles/FormHeader';

const NotFound = () => 
{
    return (
    <div>
        <FormHeader/>
            <div style = {{textAlign: 'center', marginTop: '120px'}}>
                <h1>404 Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
    </div>        
  );
};

export default NotFound;