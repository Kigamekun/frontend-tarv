

'use client'

import { useSelector, useDispatch } from 'react-redux';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa6';
import Link from "next/link";
import { decrementQuantity, incrementQuantity, removeFromCart, emptyingCart } from '@/lib/redux/cart.slice';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
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

const Cart = () => {
    const cartItems = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch();
    const [isClient, setIsClient] = useState(false)
    const router = useRouter();
    const { user, logout } = useAuth({ middleware: 'user' })
    const [selectedPayment, setSelectedPayment] = useState("CASH");

    const handlePaymentChange = (event: any) => {
        setSelectedPayment(event.target.value);
    };

    const [cartData, setCartData] = useState({
        totalItems: 0,
        totalPrice: 0,
    });

    useEffect(() => {
        setIsClient(true)
        let totalItems = cartItems.length;
        let totalPrice = cartItems.reduce((acc: number, item: { price: number; quantity: number; }) => acc + item.price * item.quantity, 0);
        setCartData({
            totalItems: totalItems,
            totalPrice: totalPrice,
        })
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


    const confirmPayment = () => {
        if (cartItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Keranjang kosong',
            })
        }


        if (selectedPayment === "CASH") {
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
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/pay`, {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            })
                .then((response) => response.text())
                .then((result) => {
                    const parsedResult = JSON.parse(result);
                    if (parsedResult.status == 'success') {
                        Swal.fire({
                            target: document.getElementById('my_modal_1'),
                            icon: 'success',
                            title: 'Pembelian Berhasil',
                            text: 'Terima kasih telah berbelanja',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            dispatch(emptyingCart());
                            router.push('/home');
                        }, 1700);
                    } else {
                        Swal.fire({
                            target: document.getElementById('my_modal_1'),
                            icon: 'error',
                            title: 'Pembelian Gagal',
                            text: parsedResult.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                })
                .catch((error) => console.error(error));



        } else if (selectedPayment === "QRIS") {
            Swal.fire({
                target: document.getElementById('my_modal_1'),
                icon: 'success',
                title: 'Pembelian Berhasil',
                text: 'Terima kasih telah berbelanja',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(() => {
                router.push('/home');
            }, 1700);
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
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/pay`, {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            })
                .then((response) => response.text())
                .then((result) => {
                    const parsedResult = JSON.parse(result);
                    if (parsedResult.status == 'success') {
                        Swal.fire({
                            target: document.getElementById('my_modal_1'),
                            icon: 'success',
                            title: 'Pembelian Berhasil',
                            text: 'Terima kasih telah berbelanja',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        setTimeout(() => {
                            dispatch(emptyingCart());
                            router.push('/home');
                        }, 1700);
                    } else {
                        Swal.fire({
                            target: document.getElementById('my_modal_1'),
                            icon: 'error',
                            title: 'Pembelian Gagal',
                            text: parsedResult.message,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                })
                .catch((error) => {
                    console.log('adanih')
                });
        }
    };

    return (
        <>
            {isClient ? (
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
                                    <center>Keranjang</center>
                                </div>
                                <div className="col-span-4" />
                            </div>
                            <br />
                            <>
                                <div className="space-y-5">
                                    {cartItems.map((cart: { id: any; image: string | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined; price: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; quantity: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }) => (
                                        <div key={cart.id}>
                                            <div className="w-100 shadow-xl rounded-2xl flex border-2">
                                                <div className="p-3">
                                                    <img
                                                        className="rounded-2xl w-40"
                                                        src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + cart.image}
                                                        alt="Movie"
                                                    />
                                                </div>
                                                <div className="flex-auto p-5 place-content-center">
                                                    <div className="font-body text-2xl text-start justify-start font-semibold">
                                                        {cart.name}
                                                    </div>
                                                    <div className="font-body text-2xl text-start font-semibold">
                                                        Rp. {cart.price} ({cart.quantity}x)
                                                    </div>
                                                    <br />
                                                    <div className="flex">
                                                        <div className="flex-1">
                                                            <div className="flex gap-4 align-items-end place-items-center">
                                                                <button type="button" onClick={() => handleDecreaseQuantity(cart.id)}
                                                                    className="focus:outline-none text-[#DC1F26] bg-white border-2 border-[#DC1F26] focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-3 py-2 me-1 mb-1 :bg-red-600 :hover:bg-red-700 :focus:ring-red-900">
                                                                    <FaMinus />
                                                                </button>
                                                                <div className="text-3xl font-body place-items-center">{cart.quantity}</div>
                                                                <button type="button" onClick={() => handleIncreaseQuantity(cart.id)}
                                                                    className="ml-1 focus:outline-none text-white bg-[#DC1F26] border-2 border-[#DC1F26] focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-3 py-2 me-1 mb-1 :bg-red-600 :hover:bg-red-700 :focus:ring-red-900">
                                                                    <FaPlus />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-rows-2 w-full rounded-t-lg bg-white mt-5 shadow-xl p-3 border-2">
                                    <div className="grid grid-rows-2 grid-cols-2">
                                        <div className="text-lg font-body">Total items ({cartData.totalItems})</div>
                                        <div className="text-lg font-body text-end">Rp. {cartData.totalPrice}</div>
                                    </div>
                                    <div className="divider" />
                                    <div className="grid grid-cols-2">
                                        <div className="text-lg font-body font-semibold">Total</div>
                                        <div className="text-lg font-body font-semibold text-end">
                                            Rp. {cartData.totalPrice}
                                        </div>
                                    </div>
                                    <div className="w-full mt-5">
                                        <button
                                            type="submit" onClick={showModal}
                                            className="w-full justify-center rounded-md bg-red-600 px-3 py-1.5 font-body text-2xl font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                        >
                                            Beli
                                        </button>
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
                            <div style={{ display: "flex", gap: 10, justifyContent: 'center' }}>
                                <center>
                                    <h2 className="font-bold text-2xl text-center">Pilih Metode Pembayaran</h2>
                                </center>
                            </div>
                            <br />
                            <div>
                                <div className="grid">
                                    <div className="my-2 grid grid-rows-3 space-y-2">
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
                                        <label className="cursor-pointer">
                                            <input type="radio" className="peer sr-only" name="payment" value="QRIS" onChange={handlePaymentChange} />
                                            <div
                                                className="w-full rounded-md bg-white p-2 text-black-600 ring-2 ring-transparent transition-all hover:shadow peer-checked:text-red-600 peer-checked:ring-red-400 peer-checked:ring-offset-2">
                                                <div className="flex justify-between place-items-center">
                                                    <div><i className="me-2 fa-solid fa-credit-card"></i></div>
                                                    <div className="text-lg font-body">QRIS</div>
                                                    <div><i className="fa-solid fa-circle-check"></i></div>
                                                </div>
                                            </div>
                                        </label>
                                        {user ? (<>
                                            <label className="cursor-pointer">
                                                <input type="radio" className="peer sr-only" name="payment" value="Hutang" onChange={handlePaymentChange} />
                                                <div
                                                    className="w-full rounded-md bg-white p-2 text-black-600 ring-2 ring-transparent transition-all hover:shadow peer-checked:text-red-600 peer-checked:ring-red-400 peer-checked:ring-offset-2">
                                                    <div className="flex justify-between place-items-center">
                                                        <div><i className="me-2 fa-solid fa-credit-card"></i></div>
                                                        <div className="text-lg font-body">Hutang</div>
                                                        <div><i className="fa-solid fa-circle-check"></i></div>
                                                    </div>
                                                </div>
                                            </label>
                                        </>) : (<></>)}
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
            ) : 'Prerendered'}
        </>
    );
};

export default Cart;


