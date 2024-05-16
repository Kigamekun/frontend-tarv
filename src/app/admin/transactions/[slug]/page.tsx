'use client';

import { useAuth } from "@/lib/hooks/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { decrementQuantity, incrementQuantity, removeFromCart } from "@/lib/redux/cart.slice";
import BottomNavBar from "@/app/components/bottomNavBar";


type Fruit = {
    id: number;
    name: string;
    price: number;
    stock: number;
    image: string;
}

type TransactionItem = {
    id: number;
    kode_transaksi: string;
    id_barang: number;
    jumlah_beli: number;
    total_harga: number;
    fruit: Fruit;
}

type Transaction = {
    id: number;
    kode_transaksi: string;
    metode_pembayaran: string;
    user_id: number;
    total: number;
    utang: number;
    status_pembayaran: string;
    tanggal_transaksi: string;
    items: TransactionItem[];
}

type ApiResponse = {
    data: Transaction[];
}

export default function Page({ params }: { params: { slug: string } }) {

    const router = useRouter()
    const [transactionData, setTransactionData] = useState<Transaction | null>(null);


    const getUserInfo = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/me`, {
            headers: {
                'content-type': 'text/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                if (response.data.data.role != '1') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Anda tidak memiliki akses',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        window.location.href = '/home'
                    },1700)
                }
            })
    }




    const getHistoryDetailTransaction = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/transaction/${params.slug}`, {
            headers: {
                'content-type': 'text/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                console.log(response.data);
                setTransactionData(response.data.data[0]);
            }).catch(function (error) {
                if (error.response && error.response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: error.response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })


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
        getHistoryDetailTransaction();
        getUserInfo();
    }, []);


    return (
        <>
            <div className="flex flex-wrap -mx-3">
                <div className="flex-none w-full max-w-full px-3">
                    <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent flex justify-between">
                            <h6 className="dark:text-white">Transaction Table</h6>
                            {/* <button className="btn btn-info text-white" onClick={() => showModal()}>Create</button> */}

                        </div>
                        <div className="flex-auto px-0 pt-0 pb-2">
                            <div className="p-5 overflow-x-auto">
                                <table className="items-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500">
                                    <thead className="align-bottom">
                                        <tr>
                                            <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Buah
                                            </th>
                                            <th className="px-6 text-center py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                QTY
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Total Harga
                                            </th>
                                            
                                            <th className="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-collapse border-solid shadow-none dark:border-white/40 dark:text-white tracking-none whitespace-nowrap text-slate-400 opacity-70" />
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {transactionData?.items.map((item, index) => (
                                            <tr key={index}>
                                                <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-10 h-10">
                                                            <img className="w-10 h-10 rounded" src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + item.fruit.image} alt="" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium dark:text-white">{item.fruit.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                    <div className="text-sm text-center dark:text-white">{item.jumlah_beli}</div>
                                                </td>
                                                <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                    <div className="text-sm text-center dark:text-white">Rp. {item.total_harga}</div>
                                                </td>
                                                <td className="p-2 text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                   
                                                    </td>
                                            </tr>
                                        ))}


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}