import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../PageComponents/DashboardComponents/Navbar.tsx'
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile data
        const userProfileResponse = await axios.get('http://localhost:4000/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        console.log('User Profile Response:', userProfileResponse.data);
        setUserData(userProfileResponse.data);
  
        // Fetch purchase history
        const historyResponse = await axios.get('http://localhost:4000/api/user/purchase-history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        });
        console.log('Purchase History Response:', historyResponse.data);
        setPurchaseHistory(historyResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const handlePasswordChange = async () => {
    try 
    {
      // Prompt the user for a new password
      const newPasswordInput = window.prompt('Enter your new password:');
      console.log('New password input:',newPasswordInput);
      if (newPasswordInput === null) 
      {
        // User clicked cancel
        return;
      }

      // Change password
      await axios.patch(
        'http://localhost:4000/api/user/change-password',
        { new_password: newPasswordInput },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        }
      );
      setChangePasswordError(null);
      setNewPassword('');
      alert('Password changed successfully!');
    } 
    
    catch (error) 
    {
      console.error('Error changing password:', error);
      setChangePasswordError(`Error changing password: ${error.message}`);
    }
  };

  if (!userData) {
    // You can render a loading indicator while fetching data
    return <p>Loading...</p>;
  }

  return (
    <div>
  
      <Navbar />
      <h2></h2>
      <div style={{ padding: '0px', border: '0px solid #dddddd', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '10px' }}>Profile Info</h2>
        <table style={{ borderCollapse: 'collapse', width: '50%' }}>
          <tbody>
            <tr>
              <td style={{ border: 'none', textAlign: 'right', padding: '5px', width: '30%' }}>First Name:</td>
              <td style={{ border: 'none', textAlign: 'left', padding: '5px' }}>{userData.FIRST_NAME}</td>
            </tr>
            <tr>
              <td style={{ border: 'none', textAlign: 'right', padding: '5px', width: '30%' }}>Last Name:</td>
              <td style={{ border: 'none', textAlign: 'left', padding: '5px' }}>{userData.LAST_NAME}</td>
            </tr>
            <tr>
              <td style={{ border: 'none', textAlign: 'right', padding: '5px', width: '30%' }}>Email:</td>
              <td style={{ border: 'none', textAlign: 'left', padding: '5px' }}>{userData.EMAIL}</td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: 'center', padding: '10px' }}>
                <button onClick={handlePasswordChange} style={{ marginRight: '10px' }}>Change Password</button>
                {changePasswordError && <p style={{ color: 'red' }}>{changePasswordError}</p>}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

        <h2>Purchase History</h2>
          <div style = {{maxHeight: '1000px', overflowY: 'auto'}}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                <tr>
                    <th style={{ border: '1px solid #dddddd', textAlign: 'center', padding: '8px' }}>Order ID</th>
                    <th style={{ border: '1px solid #dddddd', textAlign: 'center', padding: '8px' }}>Attraction name/Transport ticket</th>
                    <th style={{ border: '1px solid #dddddd', textAlign: 'center', padding: '8px' }}>Item(s)</th>
                </tr>
                </thead>
                <tbody>
                {purchaseHistory.map((purchase) => (
                    <tr key={purchase.ORDER_ID} style={{ border: '1px solid #dddddd' }}>
                    <td style={{ border: '1px solid #dddddd', textAlign: 'center', padding: '8px' }}>{purchase.ORDER_ID}</td>
                    <td style={{ border: '1px solid #dddddd', textAlign: 'center', padding: '8px' }}>{purchase.PLACE_NAME}</td>
                    <td style={{ border: '1px solid #dddddd', textAlign: 'center', padding: '8px' }}>{purchase.ITEM_QUANTITY_LIST}</td>
                    
                  </tr>
                ))}
                </tbody>
            </table>
          </div>
  

  
    </div>
    );
  };
  
  export default Dashboard;