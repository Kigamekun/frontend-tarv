

'use client'

import { useSelector, useDispatch } from 'react-redux';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, SetStateAction, useEffect, useState } from "react"
import { FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa6';
import Link from "next/link";
import { decrementQuantity, emptyingCart, incrementQuantity, removeFromCart } from '@/lib/redux/cart.slice';
import BottomNavBar from '../components/bottomNavBar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


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
    const router = useRouter();

    const cartItems = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const [isClient, setIsClient] = useState(false)
    const [historyData, setHistoryData] = useState<any[]>([]);

    const [selectedPayment, setSelectedPayment] = useState("CASH");
    const [selectedTransaction, setSelectedTransaction] = useState("");

    const handlePaymentChange = (event: any) => {
        setSelectedPayment(event.target.value);
    };

    const [cartData, setCartData] = useState({
        totalItems: 0,
        totalPrice: 0,
    });

    const getHistoryData = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/transaction-history-debt`, {
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


    const confirmPayment = () => {
        if (selectedPayment === "CASH") {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

            const raw = JSON.stringify({
                'status_pembayaran': 'pending',
                "metode_pembayaran": selectedPayment, // Menggunakan metode pembayaran yang dipilih
                "kode_transaksi": selectedTransaction,
            });

            fetch("http://localhost:4567/pay", {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            })
                .then((response) => response.text())
                .then((result) => {
                    router.push('/home');
                })
                .catch((error) => console.error(error));



        } else if (selectedPayment === "QRIS") {
            router.push('/payment/qris');
            Swal.fire({
                icon: 'success',
                title: 'Pembelian Berhasil',
                text: 'Terima kasih telah berbelanja',
                showConfirmButton: false,
                timer: 1500
            })
            dispatch({ type: 'CLEAR_CART' });
        } else if (selectedPayment === "Hutang") {

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

            const raw = JSON.stringify({
                'status_pembayaran': 'pending',
                "metode_pembayaran": selectedPayment, // Menggunakan metode pembayaran yang dipilih
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



        }


    };


    const showModal = (kode_transaksi: any) => {
        setSelectedTransaction(kode_transaksi);
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
                                        <center>List Hutang</center>
                                    </div>
                                    <div className="col-span-4" />
                                </div>
                                <br />
                                <>
                                    <div className="space-y-5">

                                        <div className=" w-100% mx-auto py-5 px-8">
                                            <div className="space-y-5">

                                                {historyData.map((item: any, index) => (

                                                    <div key={index} className="w-100 shadow-xl rounded-2xl flex border-2">
                                                        <div className="flex-auto p-5 align-items-center">
                                                            <div className="font-body text-2xl font-semibold" style={{ width: '80%' }}>{item.kode_transaksi}</div>
                                                            <br />
                                                            <div className="grid grid-rows-4 grid-cols-2 font-body text-gray-400">
                                                                <div>Jumlah</div>
                                                                <div>{item.items.length} buah</div>

                                                                <div>Harga Total</div>
                                                                <div>Rp. {item.total}</div>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <Link href={`/history/${item.kode_transaksi}`}
                                                                    className="bg-red-600 rounded-lg py-1 px-2 text-white font-body font-semibold"

                                                                >
                                                                    Lihat Detail
                                                                </Link>
                                                                <button
                                                                    type="submit"
                                                                    onClick={(e) => showModal(item.kode_transaksi)}
                                                                    className="bg-red-600 rounded-lg py-1 px-2 text-white font-body font-semibold"
                                                                >
                                                                    Bayar
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
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





                        <dialog
                            id="my_modal_1"
                            className="modal modal-bottom mx-auto min-h-full max-w-screen-sm"
                        >
                            <div className="modal-box bg-white text-black">
                                <div style={{ display: "flex", gap: 10 }}>
                                    <form method="dialog">
                                    </form>
                                    <h2 className="font-bold text-3xl">Pilih Metode Pembayaran</h2>
                                </div>
                                <br />
                                <br />
                                <br />
                                <br />
                                <div>
                                    <div className="grid">
                                        <div className="my-2 grid grid-rows-2 space-y-2">
                                            <label className="cursor-pointer">
                                                <input type="radio" className="peer sr-only" name="payment" value="CASH" defaultChecked onChange={handlePaymentChange} />
                                                <div
                                                    className="w-full rounded-md bg-white p-2 text-black-600 ring-2 ring-transparent transition-all hover:shadow peer-checked:text-red-600 peer-checked:ring-red-400 peer-checked:ring-offset-2" >
                                                    <div className="flex justify-between place-items-center">
                                                        <div><i className="me-2 fa-solid fa-credit-card"></i></div>
                                                        <div className="text-lg font-body">CASH</div>
                                                        <div><i className="fa-solid fa-circle-check"></i></div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <br />
                                    <br />
                                    <div className="w-full">
                                        <button type="submit"
                                            className="w-full justify-center rounded-md bg-red-600 px-3 py-1.5 font-body text-2xl font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onClick={confirmPayment}>Beli</button>

                                        <br />
                                        <button type="button" className="w-full mt-2 justify-center rounded-md bg-slate-600 px-3 py-1.5 font-body text-2xl font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600" onClick={() => { const modal = document.getElementById('my_modal_1') as HTMLDialogElement; if (modal) { modal.close(); } }}>
                                            Batal
                                        </button>
                                    </div>



                                    <br />
                                </div>
                            </div>
                        </dialog>




                    </main>



                    <BottomNavBar />

                </>


            ) : 'Prerendered'}
        </>
    );
};

export default History;

