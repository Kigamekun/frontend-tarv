'use client';

import { useAuth } from "@/lib/hooks/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function TransactionPage() {

    const router = useRouter()
    const { user, logout } = useAuth({ middleware: 'user' })
    const [transactionData, setFruitData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [transaction, setFruit] = useState({
        id: 0,
        name: '',
        stock: 0,
        price: 0,
        description: '',
        image: '',
        category_id: 0
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0])
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFruit({ ...transaction, [name]: value });
    }

    const getFruitData = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/transaction`, {
            headers: {
                'content-type': 'text/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                if (response.data.data != undefined) {
                    setFruitData(response.data.data);
                }
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

    const changeStatusTransaction = async (event: ChangeEvent<HTMLSelectElement>, kode_transaksi: string) => {
        var res = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/transaction/change-status/${kode_transaksi}`,
            {
                status_pembayaran: event.target.value
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            }
        )
            .then(function (response) {
                getFruitData();
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
        if (!user) return;
        getFruitData();
        getUserInfo();
    }, [user]);

    return (
        <>
            <div className="flex flex-wrap -mx-3">
                <div className="flex-none w-full max-w-full px-3">
                    <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent flex justify-between">
                            <h6 className="dark:text-white">Transaction Table</h6>
                        </div>
                        <div className="flex-auto px-0 pt-0 pb-2">
                            <div className="p-5 overflow-x-auto">
                                <table className="items-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500">
                                    <thead className="align-bottom">
                                        <tr>
                                            <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Kode Transaksi
                                            </th>
                                            <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                User
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Metode Pembayaran
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Status Pembayaran
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Tanggal Transaksi
                                            </th>
                                            <th className="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-collapse border-solid shadow-none dark:border-white/40 dark:text-white tracking-none whitespace-nowrap text-slate-400 opacity-70" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactionData.map((transaction, index) => (
                                            <>
                                                <tr>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <Link href={`/admin/transactions/${transaction.kode_transaksi}`}>
                                                            <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-80">
                                                                {transaction.kode_transaksi}
                                                            </p>
                                                        </Link>
                                                    </td>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-80">
                                                            {transaction.hasOwnProperty('nama_user') == '' ? transaction.user_anonim : transaction.nama_user}
                                                        </p>
                                                    </td>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <p className="mb-0 text-center text-xs font-semibold leading-tight dark:text-white dark:opacity-80">
                                                            Rp. {transaction.total}
                                                        </p>
                                                    </td>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <p className="mb-0 text-xs text-center font-semibold leading-tight dark:text-white dark:opacity-80">
                                                            {transaction.metode_pembayaran}
                                                        </p>
                                                    </td>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <p className="mb-0 text-xs text-center font-semibold leading-tight dark:text-white dark:opacity-80">
                                                            <select className="form-select p-2 rounded" onChange={(event) => changeStatusTransaction(event, transaction.kode_transaksi)}>
                                                                <option value='pending' {...(transaction.status_pembayaran === 'pending' ? { selected: true } : {})}>Pending</option>
                                                                <option value='lunas' {...(transaction.status_pembayaran === 'lunas' ? { selected: true } : {})}>Lunas</option>
                                                            </select>
                                                        </p>
                                                    </td>
                                                    <td className=" align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <p className="mb-0 text-xs text-center font-semibold leading-tight dark:text-white dark:opacity-80">
                                                            {(transaction.status_pembayaran == 'pending' || transaction.status_pembayaran == null) ? (
                                                                <span className="bg-gradient-to-tl from-slate-600 to-slate-300 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">Pending</span>
                                                            ) : (
                                                                <span className="bg-gradient-to-tl from-emerald-500 to-teal-400 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">Lunas</span>
                                                            )
                                                            }
                                                        </p>
                                                    </td>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <p className="mb-0 text-xs text-center font-semibold leading-tight dark:text-white dark:opacity-80">
                                                            {transaction.tanggal_transaksi}
                                                        </p>
                                                    </td>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}