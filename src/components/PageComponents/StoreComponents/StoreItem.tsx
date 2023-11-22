// Shopping cart page
import React, {useContext} from 'react'
import {cardStyle,summarybuttonStyle,buttonStyle,cartButtonStyle,removeButtonStyle} from './Store_styles.js';
import { Button,Card } from "react-bootstrap"
import { formatCurrency } from "../../utilities/formatCurrency.ts"
import { useShoppingCart } from "../../context/ShoppingCartContext.tsx"
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import { SelectedPlaceContext } from '../../PlaceDetails/SelectedPlaceContext.js';

type StoreItemProps = {
    id: number
    name: string
    price: number
    imgUrl: string
    type: string
}

const StoreItem = ({ id, name, price, imgUrl, type}:StoreItemProps) =>
{
    const {setPlace} = useContext(SelectedPlaceContext); //added line + import
    const { 
        getItemQuantity,
        IncreaseCartQuantity,
        DecreaseCartQuantity,
        removeFromCart,
        openCart,
        cartQuantity
    } = useShoppingCart()
    const quantity = getItemQuantity(id, "store")

    const selectedPlace = setPlace; //Assuming setPlace returns selected place from homepage
    

//Stable version
return (
    <Card className= "h-100" style={{ ...cardStyle, border: '3px solid grey' }}>
        <Card.Img 
            variant="top" 
            src={imgUrl} 
            height= "250px" 
            style={{objectFit: "cover", alignSelf: 'center'}}
            className= "mx-auto"
        />
        <Card.Body className= "d-flex flex-column">
            <Card.Title className= "mb-4">
                <span className= "fs-2" style ={{letterSpacing: '0.1em'}}>{name}</span>
            </Card.Title>
        
            <div className= "mt-auto d-flex justify-content-between">
                <div></div>
                <span className= "ms-2 text-muted" style ={{letterSpacing: '0.1em'}}>{formatCurrency(price)}</span>
            </div>
            {/* </Card.Title>
            <div className= "mt-auto d-flex justify-content-end">
                <span className= "ms-2 text-muted">{formatCurrency(price)}</span>
            </div> */}
            
            <div className="mt-auto">
                {quantity === 0 ? (
                    // <Button className="w-100" onClick={() => IncreaseCartQuantity(id, type)}>+ Add To Cart</Button>
                    <Button onClick={() => IncreaseCartQuantity(id, type, selectedPlace)} style = {{...buttonStyle}}>+ Add To Cart</Button>
                ) : (
                    <div className="d-flex align-items-center flex-column" style={{ gap: "5rem" }}>
                        {/* <div className="d-flex align-items-center justify-content-center" style={{ gap: "5rem" }}> */}
                            <Button onClick={() => DecreaseCartQuantity(id, type, selectedPlace)} style = {{...cartButtonStyle}}>-</Button>
                            {/* <div>
                                <span className="fs-3">{quantity}</span> in cart
                            </div> */}
                            <Button onClick={() => IncreaseCartQuantity(id, type, selectedPlace)} style = {{...cartButtonStyle}}>+</Button>
                        {/* </div> */}
                        {/* <Button onClick={() => removeFromCart(id, type)} variant="danger" size="sm">Cancle</Button> */}
                        <Button onClick={() => removeFromCart(id, type, selectedPlace)} style = {{...removeButtonStyle}}>Cancle</Button>

                        {/* {cartQuantity > 0 && (
                            // <Button onClick={openCart} style={{color: 'black', backgroundColor: 'transparent', boxShadow: 'none' }}>
                            <Button onClick={openCart} style={{...summarybuttonStyle}}><AddShoppingCart />{cartQuantity}</Button>
                        )} */}
                    </div>
                )}
            </div>
        </Card.Body>
    </Card>
);
};
    
//Stable version
//     return (
//         <Card className= "h-100" style={{ border: '3px solid grey' }}>
//             <Card.Img 
//                 variant="top" 
//                 src={imgUrl} 
//                 height= "250px" 
//                 style={{objectFit: "cover", alignSelf: 'center'}}
//                 className= "mx-auto"
//             />
//             <Card.Body className= "d-flex flex-column">
//                 <Card.Title className= "mb-4">
//                     <span className= "fs-2" style ={{letterSpacing: '0.1em'}}>{name}</span>
//                 </Card.Title>
            
//                 <div className= "mt-auto d-flex justify-content-between">
//                     <div></div>
//                     <span className= "ms-2 text-muted" style ={{letterSpacing: '0.1em'}}>{formatCurrency(price)}</span>
//                 </div>
//                 {/* </Card.Title>
//                 <div className= "mt-auto d-flex justify-content-end">
//                     <span className= "ms-2 text-muted">{formatCurrency(price)}</span>
//                 </div> */}
                
//                 <div className="mt-auto">
//                     {quantity === 0 ? (
//                         <Button className="w-100" onClick={() => IncreaseCartQuantity(id, type)}>+ Add To Cart</Button>
//                     ) : (
//                         <div className="d-flex align-items-center flex-column" style={{ gap: "5rem" }}>
//                             {/* <div className="d-flex align-items-center justify-content-center" style={{ gap: "5rem" }}> */}
//                                 <Button onClick={() => DecreaseCartQuantity(id, type)}>-</Button>
//                                 {/* <div>
//                                     <span className="fs-3">{quantity}</span> in cart
//                                 </div> */}
//                                 <Button onClick={() => IncreaseCartQuantity(id, type)}>+</Button>
//                             {/* </div> */}
//                             <Button onClick={() => removeFromCart(id, type)} variant="danger" size="sm">
//                                 Cancle
//                             </Button>

//                             {cartQuantity > 0 && (
//                                 <Button onClick={openCart} style={{ color: 'black', backgroundColor: 'transparent', boxShadow: 'none' }}>
//                                     <AddShoppingCart />
//                                     {cartQuantity}
//                                 </Button>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </Card.Body>
//         </Card>
//     );
// };

export default StoreItem;