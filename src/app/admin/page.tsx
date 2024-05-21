'use client';

import { useAuth } from "@/lib/hooks/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from 'next/image'

import { FaDownLong, FaUpLong } from "react-icons/fa6";


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


export default function AdminPage() {
    const router = useRouter()
    const { user, logout } = useAuth({ middleware: 'user' })

    const [rugi, setRugi] = useState(0);
    const [untung, setUntung] = useState(0);
    const [qris, setQris] = useState(0);
    const [cash, setCash] = useState(0);

    const [transactionData, setTransactionData] = useState<any[]>([]);
    const [hutang, setHutangData] = useState<any[]>([]);

    const [stockSaatIni, setStockSaatIni] = useState<any[]>([]);
    const [stockTerjual, setStockTerjual] = useState<any[]>([]);




    const getDashboardData = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/dashboard`, {
            headers: {
                'content-type': 'text/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                console.log(response.data)
                setRugi(response.data.data.transaction.rugi);
                setUntung(response.data.data.transaction.untung);
                setQris(response.data.data.transaction.qris);
                setCash(response.data.data.transaction.cash);
                if (response.data.data.transactionAll != undefined) {
                    setTransactionData(response.data.data.transactionAll);
                }
                if (response.data.data.transactionHutang != undefined) {
                    setHutangData(response.data.data.transactionHutang);
                }
                if (response.data.data.fruits != undefined) {
                    setStockSaatIni(response.data.data.fruits);
                }

                if (response.data.data.stockKeluar != undefined) {
                    setStockTerjual(response.data.data.stockKeluar);
                }

            })
    }

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
                    }, 1700)
                }
            })
    }

    useEffect(() => {
        console.log(`ini token ${localStorage.getItem('token')}`)

        if (localStorage.getItem('token') == null) {
            Swal.fire({
                icon: 'error',
                title: 'Anda tidak memiliki akses',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(() => {
                window.location.href = '/home'
            }, 1700)
        }

        if (!user) return;

        getUserInfo();

        getDashboardData();

    }, [user]);


    return (
        <>
            {user ? (
                <div className="w-full px-6 py-6 mx-auto">
                    <div className="flex flex-wrap -mx-3">
                        <div className="max-w-full px-3 lg:w-2/3 lg:flex-none">
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full max-w-full px-3 mb-6 xl:mb-0 xl:w-1/2 xl:flex-none">
                                    <div className="relative flex flex-col min-w-0 break-words bg-transparent border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
                                        <div
                                            className="relative overflow-hidden rounded-2xl"
                                            style={{
                                                backgroundImage:
                                                    'url("https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/card-visa.jpg")'
                                            }}
                                        >
                                            <span className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-zinc-800 to-zinc-700 dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 opacity-80" />

                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4 px-3 mb-6 lg:mb-0 lg:w-full">
                                    <div className="bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl p-4">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto bg-gradient-to-tl from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                                                <FaUpLong color="white" size={'30'} />
                                            </div>
                                            <h6 className="mt-4 dark:text-white">Laba</h6>
                                            <hr className="my-4 h-px bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
                                            <h5 className="dark:text-white">+Rp {untung}</h5>
                                        </div>
                                    </div>
                                    <div className="bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl p-4">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto bg-gradient-to-tl from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-sm">
                                                <FaDownLong color="white" size={'30'} />
                                            </div>
                                            <h6 className="mt-4 dark:text-white">Rugi</h6>
                                            <hr className="my-4 h-px bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
                                            <h5 className="dark:text-white">-Rp {rugi}</h5>
                                        </div>
                                    </div>
                                </div>


                                <div className="max-w-full px-3 mb-6 lg:mb-0 lg:w-full lg:flex-none">
                                    <div className="relative flex flex-col min-w-0 mt-6 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                                        <div className="p-4 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                                            <div className="flex flex-wrap -mx-3">
                                                <div className="flex items-center flex-none w-1/2 max-w-full px-3">
                                                    <h6 className="mb-0 dark:text-white">Metode Pembayaran</h6>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="flex-auto p-4">
                                            <div className="flex flex-wrap -mx-3">
                                                <div className="max-w-full px-3 mb-6 md:mb-0 md:w-1/2 md:flex-none">
                                                    <div className="relative flex flex-row items-center flex-auto min-w-0 p-6 break-words bg-transparent border border-solid shadow-none md-max:overflow-auto rounded-xl border-slate-100 dark:border-slate-700 bg-clip-border">

                                                        <h6 className="mb-0 dark:text-white">
                                                            Tunai&nbsp;Rp. {cash}
                                                        </h6>
                                                        <i
                                                            className="ml-auto cursor-pointer fas fa-pencil-alt text-slate-700"
                                                            data-target="tooltip_trigger"
                                                            data-placement="top"
                                                            aria-hidden="true"
                                                        />
                                                        <div
                                                            className="hidden px-2 py-1 text-sm text-white bg-black rounded-lg"
                                                            style={{
                                                                position: "absolute",
                                                                inset: "auto auto 0px 0px",
                                                                margin: 0,
                                                                transform: "translate3d(700.5px, -498px, 0px)"
                                                            }}
                                                            data-popper-placement="top"
                                                        >
                                                            Edit Card
                                                            <div
                                                                className="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']"
                                                                data-popper-arrow=""
                                                                style={{
                                                                    position: "absolute",
                                                                    left: 0,
                                                                    transform: "translate3d(0px, 0px, 0px)"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="max-w-full px-3 md:w-1/2 md:flex-none">
                                                    <div className="relative flex flex-row items-center flex-auto min-w-0 p-6 break-words bg-transparent border border-solid shadow-none md-max:overflow-auto rounded-xl border-slate-100 dark:border-slate-700 bg-clip-border">

                                                        <h6 className="mb-0 dark:text-white">
                                                            Qris&nbsp;Rp. {qris}
                                                        </h6>
                                                        <i
                                                            className="ml-auto cursor-pointer fas fa-pencil-alt text-slate-700"
                                                            data-target="tooltip_trigger"
                                                            data-placement="top"
                                                            aria-hidden="true"
                                                        />
                                                        <div
                                                            className="hidden px-2 py-1 text-sm text-white bg-black rounded-lg"
                                                            style={{
                                                                position: "absolute",
                                                                inset: "auto auto 0px 0px",
                                                                margin: 0,
                                                                transform: "translate3d(1145.5px, -498px, 0px)"
                                                            }}
                                                            data-popper-placement="top"
                                                        >
                                                            Edit Card
                                                            <div
                                                                className="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']"
                                                                style={{
                                                                    position: "absolute",
                                                                    left: 0,
                                                                    transform: "translate3d(0px, 0px, 0px)"
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-full px-3 lg:w-1/3 lg:flex-none">
                            <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                                <div className="p-4 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                                    <div className="flex flex-wrap -mx-3">
                                        <div className="flex items-center flex-none w-1/2 max-w-full px-3">
                                            <h6 className="mb-0 dark:text-white">Tagihan</h6>
                                        </div>

                                    </div>
                                </div>
                                <div className="flex-auto p-4 pb-0">
                                    <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                                        {
                                            hutang && hutang.length > 0 ? (


                                                hutang.map((item, index) => {
                                                    return (
                                                        <>

                                                            <li className="relative flex justify-between px-4 py-2 pl-0 mb-2 border-0 rounded-xl text-inherit">
                                                                <div className="flex flex-col">
                                                                    <h6 className="mb-1 text-sm font-semibold leading-normal dark:text-white text-slate-700">
                                                                        {item.nama_user}
                                                                    </h6>
                                                                    <span className="text-xs leading-tight dark:text-white dark:opacity-80">
                                                                        {item.tanggal_transaksi}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center text-sm leading-normal dark:text-white/80">
                                                                    Rp. {item.total}

                                                                </div>
                                                            </li>
                                                        </>
                                                    )
                                                })
                                            ) : (
                                                <div className="w-100 shadow-xl rounded-2xl flex border-2 p-5">
                                                    <div className="flex-auto align-items-center">
                                                        <div className="font-body text-2xl font-semibold text-center">No transaction history available.</div>
                                                        <center>
                                                            <img src="/static/images/empty-cart.jpg" style={{ width: '200px' }} alt="" />

                                                        </center>
                                                    </div>
                                                </div>
                                            )
                                        }


                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full max-w-full px-3 mt-6 md:w-4/12 md:flex-none">
                            <div className="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                                <div className="p-6 px-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                                    <h6 className="mb-0 dark:text-white">Informasi Transaksi Terkini</h6>
                                </div>
                                <div className="flex-auto p-4 pt-6">
                                    <ul className="flex flex-col pl-0 mb-0 rounded-lg">

                                        {transactionData.slice(0, 4).map((item, index) => {
                                            return (
                                                <li key={index} className="relative flex p-6 mt-4 mb-2 border-0 rounded-b-inherit rounded-xl bg-gray-50 dark:bg-slate-850">
                                                    <div className="flex flex-col">
                                                        <h6 className="mb-4 text-sm leading-normal dark:text-white">
                                                            {item.nama_user}
                                                        </h6>
                                                        <span className="mb-2 text-xs leading-tight dark:text-white/80">
                                                            Total Belanja:{" "}
                                                            <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                                                                Rp. {item.total}
                                                            </span>
                                                        </span>
                                                        <span className="mb-2 text-xs leading-tight dark:text-white/80">
                                                            Metode Pembayaran:{" "}
                                                            <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                                                                {item.metode_pembayaran}
                                                            </span>
                                                        </span>
                                                        <span className="text-xs leading-tight dark:text-white/80">
                                                            Status:{" "}
                                                            <span className="font-semibold text-slate-700 dark:text-white sm:ml-2">
                                                                {item.status_pembayaran}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })}

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-full px-3 mt-6 md:w-4/12 md:flex-none">
                            <div className="relative h-full min-w-0 mb-6 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                                <div className="p-6 px-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                                    <div className="flex flex-wrap -mx-3">
                                        <div className="max-w-full px-3 md:w-1/2 md:flex-none">
                                            <h6 className="mb-0 dark:text-white text-md">Stok Saat Ini</h6>
                                        </div>
                                        <div className="flex items-center justify-end max-w-full px-3 dark:text-white/80 md:w-1/2 md:flex-none">
                                            <i className="mr-2 far fa-calendar-alt" aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-auto p-4 pt-6">
                                    <h6 className="mb-4 text-xs font-bold leading-tight uppercase dark:text-white text-slate-500">
                                        Terbaru
                                    </h6>
                                    <ul className="flex flex-col pl-0 mb-0 rounded-lg">

                                        {
                                            stockSaatIni && stockSaatIni.map((item, index) => {
                                                return (
                                                    <>
                                                        <li className="relative flex justify-between px-4 py-2 pl-0 mb-2 border-0 border-t-0 rounded-b-inherit text-inherit rounded-xl">
                                                            <Image
                                                                className="rounded-lg"
                                                                width={50}
                                                                height={50}
                                                                src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + item.image}
                                                                alt="Picture of the author"
                                                            />
                                                            <div className="flex items-center">

                                                                <div className="flex flex-col">
                                                                    <h6 className="mb-1 text-sm leading-normal dark:text-white text-slate-700">
                                                                        {item.name}
                                                                    </h6>

                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <p className="relative z-10 inline-block m-0 text-sm font-semibold leading-normal text-transparent bg-gradient-to-tl from-red-600 to-orange-600 bg-clip-text">
                                                                    {item.stock}
                                                                </p>
                                                            </div>
                                                        </li>

                                                    </>
                                                )

                                            })
                                        }


                                    </ul>
                                </div>
                            </div>

                        </div>

                        <div className="w-full max-w-full px-3 mt-6 md:w-4/12 md:flex-none">
                            <div className="relative h-full min-w-0 mb-6 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                                <div className="p-6 px-4 pb-0 mb-0 border-b-0 rounded-t-2xl">
                                    <div className="flex flex-wrap -mx-3">
                                        <div className="max-w-full px-3 md:w-1/2 md:flex-none">
                                            <h6 className="mb-0 dark:text-white text-md">Stok Dibeli</h6>
                                        </div>
                                        <div className="flex items-center justify-end max-w-full px-3 dark:text-white/80 md:w-1/2 md:flex-none">
                                            <i className="mr-2 far fa-calendar-alt" aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-auto p-4 pt-6">
                                    <h6 className="mb-4 text-xs font-bold leading-tight uppercase dark:text-white text-slate-500">
                                        Terbaru
                                    </h6>
                                    <ul className="flex flex-col pl-0 mb-0 rounded-lg">


                                        {
                                            stockTerjual && stockTerjual.map((item, index) => {
                                                return (
                                                    <>
                                                        <li className="relative flex justify-between px-4 py-2 pl-0 mb-2 border-0 border-t-0 rounded-b-inherit text-inherit rounded-xl">
                                                            <Image
                                                                className="rounded-lg"
                                                                width={50}
                                                                height={50}
                                                                src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + item.fruit.image}
                                                                alt="Picture of the author"
                                                            />
                                                            <div className="flex items-center">

                                                                <div className="flex flex-col">
                                                                    <h6 className="mb-1 text-sm leading-normal dark:text-white text-slate-700">
                                                                        {item.fruit.name}
                                                                    </h6>

                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center">
                                                                <p className="relative z-10 inline-block m-0 text-sm font-semibold leading-normal text-transparent bg-gradient-to-tl from-red-600 to-orange-600 bg-clip-text">
                                                                    {item.jumlah_beli}
                                                                </p>
                                                            </div>
                                                        </li>

                                                    </>
                                                )

                                            })
                                        }


                                    </ul>

                                </div>
                            </div>

                        </div>
                    </div>
                    <footer className="pt-4">
                        <div className="w-full px-6 mx-auto">
                            <div className="flex flex-wrap items-center -mx-3 lg:justify-between">
                                <div className="w-full max-w-full px-3 mt-0 mb-6 shrink-0 lg:mb-0 lg:w-1/2 lg:flex-none">
                                    <div className="text-sm leading-normal text-center text-slate-500 lg:text-left">
                                        © 2024, made <i className="fa fa-heart" aria-hidden="true" />{" "}
                                        by
                                        <a
                                            href="https://www.creative-tim.com"
                                            className="font-semibold dark:text-white text-slate-700"
                                            target="_blank"
                                        >
                                            TARV
                                        </a>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </footer>
                </div>
            ) : ''}


        </>
    );
}