import React from "react"
import { Button, Stack } from "react-bootstrap"
import { useShoppingCart } from "../../context/ShoppingCartContext.js"
import storeItems from "../../data/items.json"
import transportItems from "../../data/TransportItems.json"
import { formatCurrency } from "../../utilities/formatCurrency.ts"

type CartItemProps = {
    id: number;
    quantity: number;
    type: string;
    name?: string;
    price?: number;
}

export function CartItem({ id, quantity, type }: CartItemProps) {
    const { removeFromCart } = useShoppingCart();
    const item = type === "store" ? storeItems.find((i) => i.id === id) : transportItems.find((i) => i.id === id);
    if (item == null) return null;

    return (
        <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
            <img 
                src={item.imgUrl} 
                style={{ width: "125px", height: "75px", objectFit: "cover"}}
            />
            <div className= "me-auto">
                <div>
                    {item.name}{" "}
                    {quantity > 1 && (
                    <span className="text-muted" style={{fontSize: ".65rem"}}>
                        x{quantity}
                    </span>
                    )}
                </div>
                <div className="text-muted" style={{ fontSize: ".75rem" }}>
                    {formatCurrency(item.price)}
                </div>
            </div>
            <div> 
                {formatCurrency(item.price* quantity)} 
            </div>
            
            {/* Conflicting button */}
            {/* <Button variant="outline-danger" size="sm" onClick={() => removeFromCart(item.id,item.type)}>
                &times;
            </Button> */}
        </Stack>
    )
}