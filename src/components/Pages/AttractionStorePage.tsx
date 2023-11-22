import React from "react"
import StoreItem from "../PageComponents/StoreComponents/StoreItem.tsx"
import storeItems from "../data/items.json"
import Navbar from "../PageComponents/StoreComponents/AttractionStoreNavbar.tsx"

const Store = () => {
    return (
        <>  
            <Navbar />
            <h1></h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop:'60px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', maxWidth: '800px' }}>
                    {storeItems.map(item =>(
                        <div key={item.id} style = {{marginTop: '60px'}}>
                            <StoreItem {...item} />
                        </div>    
                    ))}
                </div>
            </div>
        </>
    )
}

export default Store;