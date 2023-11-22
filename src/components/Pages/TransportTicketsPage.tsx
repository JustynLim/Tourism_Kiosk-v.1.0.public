import React from "react";
import TransportItem from '../PageComponents/StoreComponents/TransportItem.tsx';
import transportItems from '../data/TransportItems.json';
import Navbar from '../PageComponents/DashboardComponents/Navbar.tsx'

function TransportTickets() {
  return (
    <>
      <Navbar />
      <h1></h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'60px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', maxWidth: '1200px' }}>
        {transportItems.map(item => (
          <div key={item.id} style = {{marginTop: '60px'}}>
            <TransportItem {...item} />
          </div>
        ))}
      </div>
      </div>
    </>
  );
}

export default TransportTickets;
