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
import Countdown from "@/app/components/countdown";

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
    const cartItems = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const router = useRouter()
    const [transactionData, setTransactionData] = useState('');
    const [transactionImgUrl, setTransactionImgUrl] = useState('');
    const [deeplinkUrl, setDeeplinkUrl] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [total, setTotal] = useState('');
    const [expiry, setExpiry] = useState('');


    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

    const [isIntervalActive, setIsIntervalActive] = useState(true); // State untuk mengontrol aktif/tidaknya interval

    const getTransactionData = async () => {
        console.log('MASUK GET TRANSACTION DATA')
        try {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

            const raw = JSON.stringify({
                'status_pembayaran': 'lunas',
                "metode_pembayaran": 'QRIS', // Menggunakan metode pembayaran yang dipilih
                "items": cartItems.map((item: any) => ({
                    "id_barang": item.id,
                    "nama_barang": item.name,
                    "qty": item.quantity,
                    "total": item.price * item.quantity
                }))
            });

            fetch("http://localhost:4567/get-midtrans-token", {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            })
                .then((response) => response.text())
                .then((result) => {

                    var data = JSON.parse(result);

                    console.log('INI DATA', data.data.map.actions)
                    setTransactionImgUrl(data.data.map.actions.myArrayList[0].map.url);
                    setDeeplinkUrl(data.data.map.actions.myArrayList[1].map.url);
                    setTransactionId(data.data.map.transaction_id);
                    setTotal(data.data.map.gross_amount);
                    setExpiry(data.data.map.expiry_time);
                }
                )

                .catch((error) => console.error(error));




        } catch (error) {
            console.error("Error fetching transaction data:", error);
            if ((error as any).response && (error as any).response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: (error as any).response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error terjadi',
                    text: 'Mohon coba lagi nanti.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };

    const checkTransactionStatus = async (id: any, intId: any) => {


        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/check-status-midtrans/${id}`, {
                headers: {
                    'content-type': 'text/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const data = response.data.data;
            if (data.transaction_status === 'settlement') {

                if (intervalId) {
                    clearInterval(intervalId); // Hentikan interval jika status adalah 'settlement'
                }
                setIsIntervalActive(false); // Set state isIntervalActive menjadi false


                Swal.fire({
                    icon: 'success',
                    title: 'Pembelian Berhasil',
                    text: 'Terima kasih telah berbelanja',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

                    const raw = JSON.stringify({
                        'status_pembayaran': 'lunas',
                        "metode_pembayaran": 'QRIS', // Menggunakan metode pembayaran yang dipilih
                        "items": cartItems.map((item: any) => ({
                            "id_barang": item.id,
                            "qty": item.quantity,
                            "total": item.price * item.quantity
                        }))
                    });

                    fetch("http://localhost:4567/pay", {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    })
                        .then((response) => response.text())
                        .then((result) => {
                            dispatch(emptyingCart());
                            // Setelah pesan sukses ditampilkan, navigasikan pengguna kembali ke halaman utama
                            router.push('/home');
                        })
                        .catch((error) => console.error(error));



                });
            }
        } catch (error) {
            console.error(error);
            if ((error as any).response && (error as any).response.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: (error as any).response.data.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };

    useEffect(() => {
        getTransactionData();
    }, []);

    useEffect(() => {
        let intervalIds: any; // Deklarasikan variabel intervalIds di dalam useEffect
        if (isIntervalActive) {
            intervalIds = setInterval(() => {
                checkTransactionStatus(transactionId, intervalIds);
            }, 10000);
            setIntervalId(intervalIds); // Atur state intervalIds
        }
        return () => clearInterval(intervalIds);
    }, [transactionId, isIntervalActive]);



    return (
        <>

            <main className="my-0 mx-auto min-h-full max-w-screen-sm">
                <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white pb-[66px] bg">
                    <div className="p-4">
                        <div className="grid grid-flow-row-dense grid-cols-12 grid-rows-1" style={{ height: '50px' }}>
                            <div className="col-span-4 text-black font-bold"><i className="fa-solid fa-arrow-left"></i></div>
                            <div className="col-span-4 text-xl text-black font-bold font-body">
                                <center>Pembayaran</center>
                            </div>
                            <div className="col-span-4"></div>

                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between">
                                    <div className="font-body text-xl">Total</div>
                                    <div className="font-body text-xl">Bayar dalam jangka waktu <span className="text-blue-500">
                                        <Countdown expiry={expiry} />
                                    </span></div>
                                </div>
                                <div className="font-bold font-body text-2xl">
                                    Rp. {total}
                                </div>
                                <div className="flex flex-row justify-between">
                                    <div id="orderId" className="font-body text-xl">ORDER ID {transactionId}</div>
                                    <div className="font-body text-xl text-blue-500">Details</div>
                                </div>
                            </div>
                            <div>
                                <img src={transactionImgUrl} alt="" />


                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="font-bold font-body text-blue-500">Bagaimana cara membayar?</div>
                                <div className="bg-gray-100 p-3">
                                    <div className="font-body text-black-500">1. Buka aplikasi Gojek, Gopay, atau aplikasi e-wallet lainnya.</div>
                                    <div className="font-body text-black-500">2. Scan QR kode</div>
                                    <div className="font-body text-black-500">3. Konfirmasi pembayaran pada aplikasi.</div>
                                    <div className="font-body text-black-500">4. Selesai.</div>
                                </div>
                                <div>
                                    <a target="_blank" href={deeplinkUrl} type="button" style={{ width: '100%' }} className=" inline-block px-6 py-3 font-bold text-center text-white uppercase align-middle transition-all rounded-lg cursor-pointer bg-gradient-to-tl from-blue-500 to-violet-500 leading-normal text-xs ease-in tracking-tight-rem shadow-xs bg-150 bg-x-25 hover:-translate-y-px active:opacity-85 hover:shadow-md">Bayar</a>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>


        </>
    )
}