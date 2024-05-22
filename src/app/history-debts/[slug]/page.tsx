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
        console.log('INI TRX', transactionData)
    }, []);


    return (
        <>
            <main className="my-0 mx-auto min-h-full max-w-screen-sm">
                <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white pb-[66px]">
                    <div className="p-4">
                        <br />
                        <div
                            className="grid grid-flow-row-dense grid-cols-12 grid-rows-1"
                            style={{ height: 50 }}
                        >
                            <Link href={`/history-debts`} className="col-span-4 text-black font-bold">
                                <FaArrowLeft />
                            </Link>
                            <div className="col-span-4 text-xl text-black font-bold">
                                <center>Order Details</center>
                            </div>
                            <div className="col-span-4" />
                        </div>
                        <br />
                        <>
                            <div className="w-100% h-1 border-b-4 border-slate-600 border-dashed flex items-center justify-center">

                            </div>
                            <div className="border w-100% mx-auto py-5 px-8">
                                <div className="grid grid-cols-2 font-body text-lg mb-3">
                                    <div className="font-semibold ">No. Transaksi</div>
                                    <div>{transactionData?.kode_transaksi}</div>
                                    <div className="font-semibold mt-5">Waktu Pemesanan</div>
                                    <div className="mt-5">{transactionData?.tanggal_transaksi.split(',').slice(0, 2).join(',') }</div>
                                    <div className="font-semibold mt-5">Waktu Pembayaran</div>
                                    <div className="mt-5" >{transactionData?.tanggal_transaksi.split(',').slice(0, 2).join(',') }</div>
                                    <div className="font-semibold mt-5">Metode Pembayaran</div>
                                    <div className="mt-5">{transactionData?.metode_pembayaran}</div>
                                    <div className="font-semibold mt-5">Total</div>
                                    <div className="mt-5">Rp. {transactionData?.total}</div>
                                </div>
                                <br />
                                <div className="space-y-5">
                                    {transactionData?.items.map((item: TransactionItem, index) => (
                                        <div key={index} className="w-100 shadow-xl rounded-2xl flex border-2">
                                            <div className="p-5">
                                                <img
                                                    className="rounded-2xl w-40"
                                                    src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + item.fruit.image}
                                                    alt="Fruit"
                                                />
                                            </div>
                                            <div className="flex-auto p-5 align-items-center">
                                                <div className="font-body text-2xl font-semibold">{item.fruit.name}</div>
                                                <br />
                                                <div className="grid grid-rows-4 grid-cols-2 font-body text-gray-400">
                                                    <div>Jumlah</div>
                                                    <div>{item.jumlah_beli} Kg</div>

                                                    <div>Harga Total</div>
                                                    <div>Rp. {item.total_harga}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

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
        </>
    )
}