import { createSlice } from '@reduxjs/toolkit';


interface CartItem {
    id: number;
    name : string;
    quantity: number;
    image : string;
    price : number;
}

const initialState: CartItem[] = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: { payload: CartItem }) => {
            console.log('SAMPE SINI',action.payload)
            const itemExists = state.find((item) => item.id === action.payload.id);
            if (itemExists) {
                console.log('INI QUANTITY',itemExists.quantity)
                itemExists.quantity++;
            } else {
                state.push({ ...action.payload });
            }
        },
        incrementQuantity: (state, action: { payload: number }) => {
            const item = state.find((item) => item.id === action.payload);
            if (item) {
                item.quantity++;
            }
        },
        decrementQuantity: (state, action: { payload: number }) => {
            const item = state.find((item) => item.id === action.payload);
            if (item && item.quantity === 1) {
                const index = state.findIndex((item) => item.id === action.payload);
                state.splice(index, 1);
            } else if (item) {
                item.quantity--;
            }
        },
        removeFromCart: (state, action: { payload: number }) => {
            const index = state.findIndex((item) => item.id === action.payload);
            state.splice(index, 1);
        },

        emptyingCart: (state) => {
            state.splice(0, state.length); // Menghapus semua item dari array state
            localStorage.removeItem('cart'); // Menghapus data cart dari local storage jika perlu
        }
    },
});

export const cartReducer = cartSlice.reducer;

export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart, emptyingCart } = cartSlice.actions;