import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import FormHeader from '../Pages/FormStyles/FormHeader';

export const Login = (props) => 
{
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const [status, setStatus] = useState('');
    const [statusColor, setStatusColor] = useState('');

    const handleSubmit = async(e) => 
    {
        e.preventDefault();
        if (!email || !pass)
        {
            setStatus('Fields cannot be blank');
            setStatusColor('red');
            return;
        }
        const data = {email:email, password:pass};
            
        try
        {
            const response = await fetch('http://localhost:4000/login/',
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(data),
            });
        

        const responseData = await response.json();
        if (response.ok){
            localStorage.setItem('access_token', responseData.access_token);  // Store the token
            setStatus(responseData.message || 'Login Successful');
            setStatusColor('green');
            if (props.redirectPath) {
                navigate(props.redirectPath);
              } 
            else {
                navigate('/'); // Default redirect to home page
              }
        }  
        else
        {
            setStatus(responseData.message);
            setStatusColor('red');
        }
        }
        catch(error)
        {
            console.error('Error',error);
            setStatus('Connection error. Please try again');
            setStatusColor('red');
        }  
    };

    return (
        <div>
            <FormHeader />
            <div className="auth-form-container">
                <h2>Sign In</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="user@domain.com" id="email" name="email" />
                    
                    <label htmlFor="password">Password</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                    
                    <button type="submit" style={{ backgroundColor: "#4CAF50", border: "none", color: "white", padding: "15px 32px", textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "16px", margin: "10px 6px", transitionDuration: "0.4s", cursor: "pointer" }}>Sign In</button>
                </form>
                    <div>
                        {status && <p style = {{color: statusColor}}>{status}</p>}
                    <span>Don't have an account? </span>
                    <button className="link-btn" style={{ backgroundColor: "transparent", border: "none", padding: 0, font: "inherit", cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate('/register')}>Sign Up</button>
                    </div>
            </div>
        </div>
    );
};