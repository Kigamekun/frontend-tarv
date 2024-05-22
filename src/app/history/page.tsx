

'use client'

import { useSelector, useDispatch } from 'react-redux';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction, useEffect, useState } from "react"
import { FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa6';
import Link from "next/link";
import { decrementQuantity, incrementQuantity, removeFromCart } from '@/lib/redux/cart.slice';
import BottomNavBar from '../components/bottomNavBar';
import axios from 'axios';
import Swal from 'sweetalert2';


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

const History = () => {
    const cartItems = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const [isClient, setIsClient] = useState(false)
    const [historyData, setHistoryData] = useState<any[]>([]);

    const [cartData, setCartData] = useState({
        totalItems: 0,
        totalPrice: 0,
    });

    const getHistoryData = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/transaction-history`, {
            headers: {
                'content-type': 'text/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') || '' // token

            }
        }).then(function (response: { data: { data: SetStateAction<any[]>; }; }) {
            console.log(response.data);
            setHistoryData(response.data.data);
        }
        ).catch(function (error: { response: { status: number; data: { message: any; }; }; }) {
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        });
    }


    useEffect(() => {
        setIsClient(true)
        let totalItems = cartItems.length;
        let totalPrice = cartItems.reduce((acc: number, item: { price: number; quantity: number; }) => acc + item.price * item.quantity, 0);
        setCartData({
            totalItems: totalItems,
            totalPrice: totalPrice,
        })
        getHistoryData();

    }, [cartItems])


    const handleIncreaseQuantity = (id: number) => {
        dispatch(incrementQuantity(id));
    }

    const handleDecreaseQuantity = (id: number) => {

        if (cartItems.find((item: { id: number; }) => item.id === id).quantity === 1) {
            dispatch(removeFromCart(id));
        } else {
            dispatch(decrementQuantity(id));
        }
    }

    const showModal = () => {
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }

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
                                        <center>Histori Transaksi</center>
                                    </div>
                                    <div className="col-span-4" />
                                </div>
                                <br />
                                <>
                                    <div className="space-y-5 ">

                                        <div className=" w-100% mx-auto py-5 px-8">
                                            <div className="space-y-5">

                                                {historyData && historyData.length > 0 ? (
                                                    historyData.map((item: any, index) => (
                                                        <div key={index} className="w-100 shadow-xl rounded-2xl flex border-2">
                                                            <div className="flex-auto p-5 align-items-center">
                                                                <div className="w-full font-body text-2xl font-semibold">
                                                                    <span style={{ width: "500px", display: "inline-block" }}>{item.kode_transaksi}</span>
                                                                </div>
                                                                <div className="flex flex-col font-body text-gray-400">
                                                                    <div className='flex justify-between'>
                                                                        <div>Tanggal Pesanan</div>
                                                                        <div>{item.tanggal_transaksi.split(',').slice(0, 2).join(',')}</div>
                                                                    </div>
                                                                    <div className='flex justify-between'>
                                                                        <div>Jumlah</div>
                                                                        <div>{item.items.length} buah</div>
                                                                    </div>
                                                                    <div className='flex justify-between'>
                                                                        <div>Harga Total</div>
                                                                        <div>Rp. {item.total}</div>
                                                                    </div>
                                                                    <div className='flex mt-5' >
                                                                        {item.status_pembayaran == 'pending' ? (
                                                                            <button className="text-white btn btn-warning">Pending</button>) :
                                                                            item.status_pembayaran == 'lunas' ? (
                                                                                <button className="text-white btn btn-success">Lunas</button>) :
                                                                                (<button className="text-white btn btn-danger bg-red-600">Gagal</button>)
                                                                        }
                                                                    </div>
                                                                    <div className='flex mt-5'>
                                                                        <Link className="bg-red-600 rounded-lg py-3 px-4 text-white font-body font-semibold" href={`/history/${item.kode_transaksi}`}>
                                                                            Lihat Detail
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="w-100 shadow-xl rounded-2xl flex border-2 p-5">
                                                        <div className="flex-auto align-items-center">
                                                            <div className="font-body text-2xl font-semibold text-center">No transaction history available.</div>
                                                            <img src="static/images/empty-cart.jpg" alt="" />
                                                        </div>
                                                    </div>
                                                )

                                                }

                                            </div>
                                        </div>



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

