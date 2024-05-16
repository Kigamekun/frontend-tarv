import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './cart.slice';


const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cart', serializedState);
    } catch {
        // ignore write errors
    }
};

const reducer = {
    cart: cartReducer,
};

const persistedState = loadState();

const store = configureStore({
    reducer,
    preloadedState: persistedState,
});

store.subscribe(() => {
    saveState({
        cart: store.getState().cart
    });
});

export default store;
