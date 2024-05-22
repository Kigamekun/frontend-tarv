

'use client'

import { useSelector, useDispatch } from 'react-redux';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa6';
import Link from "next/link";
import { decrementQuantity, incrementQuantity, removeFromCart } from '@/lib/redux/cart.slice';
import BottomNavBar from '../components/bottomNavBar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from "@/lib/hooks/auth";


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


interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    birth : string;
    phone : string;
    gender : string;
}

const History = () => {

    const [isClient, setIsClient] = useState(false)
    const [userData, setUserData] = useState<User | null>(null);

    const { user, logout } = useAuth({ middleware: 'user' })

    const onClickLogout = () => {
        Swal.fire({
            title: "Anda yakin?",
            text: "Anda akan logout!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6A9944",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                logout(); // Execute the logout function
            } else {
                Swal.fire("Cancelled", "Logout cancelled", "error");
            }
        });
    };

    const getUserInfo = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/me`, {
            headers: {
                'content-type': 'text/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                setUserData(response.data.data);
            }).catch(function (error) {
                if (error.response && error.response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: error.response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    logout()
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'error terjadi',
                        text: 'mohon coba lagi nanti.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }



    useEffect(() => {
        setIsClient(true)
        if (!user) return;
        getUserInfo()
        console.log(userData)
    }, [user])



    return (
        <>
            {isClient ? (
                <>
                    <main className="my-0 mx-auto min-h-full max-w-screen-sm">
                        <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white pb-[66px]">
                            <div className="p-4">
                                <br />
                                <div
                                    className="grid grid-flow-row-dense grid-cols-12 grid-rows-1"
                                    style={{ height: 50 }}
                                >
                                    <Link href={`/home`} className="col-span-4 text-black font-bold">
                                        <FaArrowLeft />
                                    </Link>
                                    <div className="col-span-4 text-xl text-black font-bold">
                                        <center>Profile</center>
                                    </div>
                                    <div className="col-span-4" />
                                </div>
                                <br />
                                <>
                                    <div className="space-y-5">

                                        <>
                                            <div>
                                                <div className="wrapper-hero" style={{ height: 600 }}>
                                                    <center>
                                                        <div>
                                                            <img
                                                                className="rounded-full w-2/5"
                                                                src="assets/img/Asset1@3x-100.jpg"
                                                            />
                                                        </div>
                                                        <div

                                                            className="z-0 block p-6 font-body bg-white rounded-lg shadow hover:bg-gray-100 w-4/5 mt-10"
                                                        >
                                                            <h5 className="mb-2 text-2xl font-bold font-body text-black text-center">
                                                                {userData && userData.name}
                                                            </h5>
                                                            <p className="font-normal text-gray-700 dark:text-gray-400 mb-2 text-center font-body">
                                                                {userData && userData.email}
                                                            </p>
                                                            <div className="text-gray-600">
                                                                <div className="flex">
                                                                    <h5 className="mb-2 text-sm flex-1 text-left">Nama</h5>
                                                                    <h5 className="mb-2 text-sm flex-none text-left">:</h5>
                                                                    <h5 className="mb-2 text-sm flex-1 text-right">
                                                                    {userData && userData.name}
                                                                    </h5>
                                                                </div>
                                                                <div className="flex" style={{ justifyContent: "space-between" }}>
                                                                    <h5 className="mb-2 text-sm flex-1 text-left">Email</h5>
                                                                    <h5 className="mb-2 text-sm flex-none text-left">:</h5>
                                                                    <h5 className="mb-2 text-sm flex-1 text-right">
                                                                    {userData && userData.email}
                                                                    </h5>
                                                                </div>
                                                                <div className="flex" style={{ justifyContent: "space-between" }}>
                                                                    <h5 className="mb-2 text-sm flex-1 text-left">No HP</h5>
                                                                    <h5 className="mb-2 text-sm flex-none text-left">:</h5>
                                                                    <h5 className="mb-2 text-sm flex-1 text-right">{userData && userData.phone}</h5>
                                                                </div>
                                                                <div className="flex" style={{ justifyContent: "space-between" }}>
                                                                    <h5 className="mb-2 text-sm flex-1 text-left">Tanggal Lahir</h5>
                                                                    <h5 className="mb-2 text-sm flex-none text-left">:</h5>
                                                                    <h5 className="mb-2 text-sm flex-1 text-right">{userData && userData.birth}</h5>
                                                                </div>
                                                                <div className="flex" style={{ justifyContent: "space-between" }}>
                                                                    <h5 className="mb-2 text-sm flex-1 text-left">Jenis Kelamin</h5>
                                                                    <h5 className="mb-2 text-sm flex-none text-left">:</h5>
                                                                    <h5 className="mb-2 text-sm flex-1 text-right">{userData && userData.gender}</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </center>
                                                </div>
                                            </div>
                                            <div className="grid grid-rows-2 grid-cols-1 w-1/2 mx-auto gap-3 font-body">
                                                <Link href={`/edit-profile`}>
                                                    <button className="w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                                        <a href="edit-profile">Edit Data</a>
                                                    </button>
                                                </Link>
                                                <button className="w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onClick={ onClickLogout }>
                                                    Log Out
                                                </button>
                                            </div>
                                        </>



                                    </div>
                                </>



                                <br />
                                <br />
                                <br />
                            </div>
                            <br />
                        </div>







                    </main>



                    <BottomNavBar />

                </>


            ) : ''}
        </>
    );
};

export default History;

function logout() {
    throw new Error('Function not implemented.');
}

