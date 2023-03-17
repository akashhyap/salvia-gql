import { createContext, useState, useEffect } from 'react';


export const CartContext = createContext([
    null,
    () => {}
  ]);

export const AppProvider = ( props ) => {

	const [ cart, setCart ] = useState( null );

	useEffect( () => {

		// @TODO Will add option to show the cart with localStorage later.
		if ( typeof window !== undefined ) {

			let cartData = localStorage.getItem( 'woo-next-cart' );
			cartData = null !== cartData ? JSON.parse( cartData ) : '';
			setCart( cartData );

		}

	}, [] );

	return (
		<CartContext.Provider value={ [ cart, setCart ] }>
			{console.log("ca:", cart)}
			{ props.children }
		</CartContext.Provider>
	);
};
