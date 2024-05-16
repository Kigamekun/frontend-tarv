'use client';

import { useAuth } from "@/lib/hooks/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, emptyingCart, incrementQuantity, removeFromCart } from "@/lib/redux/cart.slice";
import BottomNavBar from "@/app/components/bottomNavBar";

interface CartState {
    [x: string]: any;
    id: number;
    name: string;
    quantity: number;
    image: string;
    price: number;
}

interface RootState {
    cart: CartState;
}


export default function Page({ params }: { params: { slug: string } }) {
   
    return (
        <>
            DEBT PAGE
        </>
    )
}