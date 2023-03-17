import React, { useState } from 'react'
import jwtDecode from 'jwt-decode'
const CheckoutButton= () => {
    const session = useState( () => {
        const jwtSession = window.localStorage.getItem('woo-session');
        if( !jwtSession ) return null;
        try {
            const decoded = jwtDecode<{ data: { customer_id: string } }>(jwtSession);
            return decoded.data.customer_id;
        } catch( err ) {
            console.warn("err:", err);
            return null;
        }
    } )
    const checkoutLink = () => {
        window.open(`https://woocommerce-186938-3327038.cloudwaysapps.com/checkout?session_id=${session[0]}`)
    }
    return(
        <button className='p-2 bg-slate-900 rounded-md text-white' onClick={ () => checkoutLink() }>Checkout</button>
    )
}
export default CheckoutButton;