import React, {useState,createContext,useContext} from 'react'; //Added contexts
import {Box,Typography,Button,Card,CardMedia,CardContent,CardActions,Chip} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import Rating from '@material-ui/lab/Rating';
import QRCode from 'qrcode.react'
import useStyles from './styles.js';
import { Link, useNavigate } from 'react-router-dom';
import { checkUserAuthentication } from '../utilities/authUtils.js';
import { useShoppingCart } from '../context/ShoppingCartContext.js';
import {SelectedPlaceContext} from './SelectedPlaceContext.js';

const PlaceDetails = ({place, selected, refProp, type}) => 
{
    if(selected) refProp?.current?.scrollIntoView({behavior: "smooth", block: "start"});
    const classes               = useStyles();
    const name                  = place.name; //Fetch place name (string)
    const address               = place.address; // Fetch the address string from the place object (GPT)
    const [showQR, setShowQR]   = useState(false);
    const {addToCart} = useShoppingCart();
    const baseURL = 'https://www.google.com/maps/place/';
    const qrCodeValue = `${baseURL}${encodeURIComponent(place.address.replace(/\s/g, '+'))}`;

    const {setPlace} = useContext(SelectedPlaceContext);
    
    //Added selectedplace
    const SelectedPlaceProvider = () =>{
        const [selectedPlace,setselectedPlace] = useState(null);
    }

    const [isAuthenticated,setAuthenticated ] = useState(false);
    const navigate = useNavigate();

    const [selectedPlaceName, setSelectedPlaceName] = useState('');

    const handleGoToStore = async () => {
        try 
        {
            console.log('Checking auth...');
            const isAuthenticated = await checkUserAuthentication();
            console.log('Is authenticated',isAuthenticated);
      
            if (isAuthenticated) 
            {
            console.log('Authentication successful. Navigating to /store');
            console.log('Place name:', place.name);
              setAuthenticated(true); // Update authentication status
              setPlace({name: place.name}); // Set the selected place name in the state
              navigate('/store');              
            } 
            
            else 
            {
            console.log('User is not authenticated. Redirecting to /login');
              navigate('/login');
            }

          } catch (error) 
          {
            console.error('Error checking authentication:', error);
        }
        };

    return(
        <Card elevation={6}>
            <CardMedia
                style={{height:350}}
                image={place.photo? place.photo.images.large.url :'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'}
                title={place.name}
            />
            <CardContent>
                <Typography gutterBottom variant ="h5">{place.name}</Typography>
                <Box display = "flex" justifyContent = "space-between">
                    <Rating name ="read-only" value = {Number(place.rating)} readOnly/>
                    <Typography component = "subtitle1">{place.num_reviews} review(s)  </Typography>
                </Box>

                <Box display = "flex" justifyContent = "space-between">

                    <Typography variant = "subtitle1">Price</Typography>
                    <Typography gutterBottom variant = "subtitle1">{place.price_level}</Typography>
                
                </Box>

                <Box display = "flex" justifyContent = "space-between">

                    <Typography variant = "subtitle1">Ranking</Typography>
                    <Typography gutterBottom variant = "subtitle1">{place.ranking}</Typography>

                </Box>
                {place?.awards?.map((award)=>(
                    <Box display = "flex" justifyContent="space-between" my = {1} alignItems = "center">
                        <img src={award.images.small}/>
                        <Typography variant = "subtitle2" color = "textSecondary"> {award.display_name}</Typography>
                    </Box>
                ))}
                {place?.cuisine?.map(({name}) => (
                    <Chip key = {name} size = "small" label = {name} className = {classes.chip} />
                ))}
                {place.address && (
                    <Typography gutterBottom variant = "body2" color = "textSecondary" className = {classes.subtitle}>
                    <LocationOnIcon/> {place.address}
                    </Typography>
                )}
                {place?.phone && (
                    <Typography gutterBottom variant = "body2" color = "textSecondary" className = {classes.spacing}>
                    <PhoneIcon/> {place.phone}
                    </Typography>
                )}
            </CardContent>

            <CardActions>
                <Button size = "small" color = "primary" onClick = {() => window.open(place.web_url, '_blank')}> 
                    Trip Advisor
                </Button>
                {/* Swap website function with 'Navigate there', opening a sub window (greyed out bg) generating a QR code redirecting user to location on Google Maps */}
                <Button size="small" color="primary" onClick={() => setShowQR(!showQR)}>
                    {showQR ? 'Hide QR Code' : 'Navigate there: Show QR Code'}
                </Button>
                {showQR && (
                    <div style={{ marginTop: '10px' }}>
                        <QRCode value={qrCodeValue} />
                    </div>
                )}
            </CardActions>

            <CardActions>
                {type ==='attractions' && (
                <Button
                    size="small"
                    color="primary"
                    onClick={handleGoToStore}
                >
                    Buy tickets
                </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default PlaceDetails;