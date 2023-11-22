import React from 'react';
import {CssBaseline} from '@material-ui/core';
import './components/Pages/FormStyles/FormStyles.css';

import {BrowserRouter, Form, Route, Routes} from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import LoginPage from './components/Pages/LoginPage';
import RegistrationPage from './components/Pages/RegistrationPage';
import Store from './components/Pages/AttractionStorePage.tsx'
import Checkout from './components/Pages/CheckoutPage.tsx';
import TransportTickets from './components/Pages/TransportTicketsPage.tsx';
import ShoppingCartProvider from './components/context/ShoppingCartContext.tsx'
import Dashboard from './components/Pages/DashboardPage.jsx';
import Minigamepage from './components/Pages/MinigamePage';
import { FeedbackPage } from './components/Pages/FeedbackPage.jsx';
import {SelectedPlaceProvider} from './components/PlaceDetails/SelectedPlaceContext';
import NotFound from './components/Pages/404Page';

const App = () => 
{
    return (
        <BrowserRouter>
            <SelectedPlaceProvider>
                <ShoppingCartProvider>
                    <CssBaseline />
                    <Routes>
                        <Route path = "/" element = {<HomePage />} index = {true} /> {/* Set default */}
                        <Route path = "/login" element = {<LoginPage />} />
                        <Route path = "/register" element = {<RegistrationPage />} />
                        <Route path="/store" element = {<Store />} />
                        <Route path="/checkout" element = {<Checkout />} />
                        <Route path="/transport-tickets" element={<TransportTickets />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/minigame" element={<Minigamepage />} />
                        <Route path="/feedback" element={<FeedbackPage />} />
                        <Route path = "*" element={<NotFound />} />
                    </Routes>
                </ShoppingCartProvider>
            </SelectedPlaceProvider>
        </BrowserRouter>
            
    );
};

export default App;