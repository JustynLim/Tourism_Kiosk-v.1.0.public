import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormHeader from '../Pages/FormStyles/FormHeader';

export const Register = (props) => 
{
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    const [status, setStatus] = useState('');
    const [statusColor, setStatusColor] = useState('');

    const handleSubmit = async(e) => 
    {
        e.preventDefault();
        if (!firstName || !lastName || !email || !pass || !confirmPass)
        {
            setStatus('Fields cannot be blank');
            setStatusColor('red');
            return;
        }
        if (pass !== confirmPass)
        {
            setStatus('Passwords do not match');
            return;
        }
        const data = {email:email, password:pass, firstName:firstName, lastName: lastName};
            
        try
        {
            const response = await fetch('http://localhost:4000/register/',
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(data),
            });
        

        const responseData = await response.json();
        if (response.ok)
        {
            setStatus(responseData.message || 'Registration Successful');
            setStatusColor('green');
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
                <h2>Sign Up</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input value={firstName} name="firstName" onChange={(e) => setFirstName(e.target.value)} id="firstName" placeholder="John" />
                    
                    <label htmlFor="lastName">Last Name</label>
                    <input value={lastName} name="lastName" onChange={(e) => setLastName(e.target.value)} id="lastName" placeholder="Doe" />
                    
                    <label htmlFor="email">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="user@domain.com" id="email" name="email" />
                    
                    <label htmlFor="password">Password</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                    
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" placeholder="********" id="confirmPassword" name="confirmPassword" style = {{marginBottom:"40px"}}/>
                    
                    <button type="submit" style={{ backgroundColor: "#4CAF50", border: "none", color: "white", padding: "15px 32px", textAlign: "center", textDecoration: "none", display: "inline-block", fontSize: "16px", margin: "10px 6px", transitionDuration: "0.4s", cursor: "pointer" }}>Register</button>
                </form>
                <div>
                    {status && <p style = {{color: statusColor}}>{status}</p>}
                <span>Already have an account? </span>
                <button className="link-btn" style={{ backgroundColor: "transparent", border: "none", padding: 0, font: "inherit", cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate('/login')}>Sign In</button>
                </div>
                
            </div>
        </div>
    );
};