'use client'

import { useAuth } from "@/lib/hooks/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, } from "react"
import { FaFilter, FaCartShopping } from "react-icons/fa6";
import Swal from 'sweetalert2'

import Image from 'next/image'

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/lib/redux/cart.slice';
import BottomNavBar from "../components/bottomNavBar";
import { get } from "http";

interface Product {
    id: number;
    quantity: number;
}

interface ProductProps {
    product: Product;
}



export default function Home() {

    const router = useRouter()
    // const { user, logout } = useAuth({ middleware: 'user' })
    const [fruitData, setFruitData] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(0);


    const [product, setProduct] = useState<Product>({
        id: 1,
        quantity: 1
    });

    const dispatch = useDispatch();
    const cartItems = useSelector((state: any) => state.cartItems);

    const handleAddToCart = (fruit: any) => {
        dispatch(addToCart({
            id: fruit.id,
            quantity: 1,
            image: fruit.image,
            name: fruit.name,
            price: fruit.price
        }));

        Swal.fire({
            icon: 'success',
            title: 'Berhasil ditaruh di keranjang',
            showConfirmButton: false,
            timer: 1500
        });
    };




    const getFruitData = async (searchQuery: any) => {

        Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we fetch the data',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits`, {
            params: { search: searchQuery },
            headers: {
                'content-type': 'text/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                if (response.data.data != undefined) {
                    setFruitData(response.data.data);

                }
                Swal.close();
            }).catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'error terjadi',
                    text: 'mohon coba lagi nanti.',
                    showConfirmButton: false,
                    timer: 1500
                });
            })
    }

    useEffect(() => {
        // if (!user) return;
        getFruitData('');
        // }, [user]);
    }, []);



    const handleSearchChange = (e: any) => {
        setSearchValue(e.target.value);
        console.log('masuk sini')
        getFruitData(e.target.value);
    };

    return (
        <>
            <main className="my-0 mx-auto min-h-full max-w-screen-sm">
                <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white pb-[66px]">
                    <div className="p-4">
                        <div className="grid grid-flow-row-dense grid-cols-7 grid-rows-1">
                            <div className="col-span-6">
                                <form className=" mx-auto mt-1">
                                    <label
                                        htmlFor="default-search"
                                        className="mb-2 text-sm font-medium text-gray-900 sr-only :text-white"
                                    >
                                        Search
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg
                                                className="w-6 h-6 text-gray-500 :text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                                />
                                            </svg>
                                        </div>
                                        <input
                                            style={{ boxShadow: "0 8px 30px rgb(0,0,0,0.12)" }}
                                            type="search"
                                            id="default-search"
                                            onChange={handleSearchChange}
                                            className="block w-full px-6 py-5 ps-14 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 :bg-gray-700 :border-gray-600 :placeholder-gray-400 :text-white :focus:ring-blue-500 :focus:border-blue-500"
                                            placeholder="Cari Items ...."
                                            required
                                        />
                                        {/* <button type="submit"
                                    class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 :bg-blue-600 :hover:bg-blue-700 :focus:ring-blue-800">Search</button> */}
                                    </div>
                                </form>
                            </div>
                            <div>
                                <div className="mt-1 px-2">
                                    <center>
                                        <button
                                            type="button"
                                            className="focus:outline-none text-white bg-[#DC1F26] focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-5 me-2 mb-2 :bg-red-600 :hover:bg-red-700 :focus:ring-red-900"
                                        >
                                            <Link href={'/cart'}>
                                                <FaCartShopping className="w-6 h-5" /></Link>

                                        </button>
                                    </center>
                                </div>
                            </div>
                        </div>
                        <br />
                        <Carousel className="w-full ">
                            <CarouselContent>
                                {/* <CarouselItem >
                                    <div style={{ display: 'flex', 'justifyContent': 'center', margin: 'auto' }}>
                                        <img src="/static/images/banner1.png" alt="" className="rounded" />
                                    </div>
                                </CarouselItem>
                                <CarouselItem >
                                    <div style={{ display: 'flex', 'justifyContent': 'center', margin: 'auto' }}>
                                        <img src="/static/images/banner2.png" alt="" className="rounded" />
                                    </div>
                                </CarouselItem> */}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        {/* <div style={{ display: "flex", }}>
                            <span
                                style={{ fontSize: 12 }}
                                className="bg-[#DC1F26] text-white text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                            >
                                Buah Buahan
                            </span>
                            <span
                                style={{ fontSize: 12 }}
                                className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                            >
                                Sayuran
                            </span>

                        </div> */}
                        <br />
                        <br />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: 10
                            }}
                        >

                            {fruitData.map((fruit) => (
                                <>
                                    <div
                                        style={{ width: "18.5rem", border: "none !important" }}
                                        className="flex flex-col bg-white rounded-lg  :bg-gray-800 :border-gray-700"
                                    >
                                        <center>

                                            <Link href={`/home/${fruit.id}`}>

                                                <div className="w-full relative aspect-square">
                                                    <Image
                                                        fill={true}
                                                        className="rounded-lg"
                                                        src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + fruit.image}
                                                        alt="Picture of the author"
                                                    />
                                                </div>
                                            </Link>

                                        </center>
                                        <Link href={`/home/${fruit.id}`}>
                                            <h5 className="px-5 mb-1 text-2xl font-bold tracking-tight text-gray-900 :text-white">
                                                {fruit.name}
                                            </h5>
                                        </Link>
                                        <p className="px-5 text-[#a2a2a2] mb-1">Stok : {fruit.stock}</p>
                                        <p className="px-5 mb-3 font-normal text-gray-700 :text-gray-400">
                                            {fruit.description}
                                        </p>
                                        <div className="flex mt-auto px-5" style={{ justifyContent: "space-between" }}>
                                            <div>
                                                <span>
                                                    <h5 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 :text-white">
                                                        Rp. {fruit.price} <span className="text-sm text-gray-500">/ Kg</span>
                                                    </h5>
                                                </span>
                                            </div>
                                            <div>
                                                <button
                                                    type="button" onClick={() => handleAddToCart(fruit)}
                                                    className="text-white bg-[#DC1F26] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </>
                            ))}

                        </div>
                    </div>
                </div>
                <dialog
                    id="my_modal_1"
                    className="modal modal-bottom mx-auto min-h-full max-w-screen-sm"
                >
                    <div className="modal-box bg-white text-black">
                        <div style={{ display: "flex", gap: 10 }}>
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                {/* <button class="btn" style="background: white;color: black;width: 5px    !important;height: 5px     !important;">X</button> */}
                            </form>
                            <h2 className="font-bold text-3xl">Filter</h2>
                        </div>
                        <br />
                        <div>
                            <div className="mb-3">
                                <p className="text-xl font-bold">Jenis Buah</p>
                                <br />
                                <div style={{ display: "flex", gap: 10 }}>
                                    <span
                                        style={{ fontSize: 12 }}
                                        className="bg-[#DC1F26] text-white text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                    >
                                        Fruits
                                    </span>
                                    <span
                                        style={{ fontSize: 12 }}
                                        className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                    >
                                        Fruits
                                    </span>
                                </div>
                            </div>
                            <br />
                            <p className="text-xl font-bold">Rasa Buah</p>
                            <br />
                            <div style={{ display: "flex", gap: 10 }}>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-[#DC1F26] text-white text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    Fruits
                                </span>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    Fruits
                                </span>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    Fruits
                                </span>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    Fruits
                                </span>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    Fruits
                                </span>
                            </div>
                            <br />
                            <p className="text-xl font-bold">Harga</p>
                            <br />
                            <div className="flex" style={{ justifyContent: "center", gap: 20 }}>
                                <div>
                                    <form className=" mx-auto mt-1">
                                        <label
                                            htmlFor="default-search"
                                            className="mb-2 text-sm font-medium text-gray-900 sr-only :text-white"
                                        >
                                            Search
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                Rp.
                                            </div>
                                            <input
                                                style={{ boxShadow: "0 8px 30px rgb(0,0,0,0.12)" }}
                                                type="search"
                                                id="default-search"
                                                className="block w-full px-6 py-5 ps-14 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 :bg-gray-700 :border-gray-600 :placeholder-gray-400 :text-white :focus:ring-blue-500 :focus:border-blue-500"
                                                placeholder="Cari Items ...."
                                                required
                                            />
                                            {/* <button type="submit"
                                        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 :bg-blue-600 :hover:bg-blue-700 :focus:ring-blue-800">Search</button> */}
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    <form className=" mx-auto mt-1">
                                        <label
                                            htmlFor="default-search"
                                            className="mb-2 text-sm font-medium text-gray-900 sr-only :text-white"
                                        >
                                            Search
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                Rp.
                                            </div>
                                            <input
                                                style={{ boxShadow: "0 8px 30px rgb(0,0,0,0.12)" }}
                                                type="search"
                                                id="default-search"
                                                className="block w-full px-6 py-5 ps-14 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 :bg-gray-700 :border-gray-600 :placeholder-gray-400 :text-white :focus:ring-blue-500 :focus:border-blue-500"
                                                placeholder="Search Mockups, Logos..."
                                                required
                                            />
                                            {/* <button type="submit"
                                        class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 :bg-blue-600 :hover:bg-blue-700 :focus:ring-blue-800">Search</button> */}
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <br />
                            <p className="text-xl font-bold">Rating</p>
                            <br />
                            <div style={{ display: "flex", gap: 10 }}>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    1
                                </span>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    Fruits
                                </span>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    Fruits
                                </span>
                                <span
                                    style={{ fontSize: 12 }}
                                    className="bg-white text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                                >
                                    Fruits
                                </span>
                            </div>
                            <br />
                        </div>
                    </div>
                </dialog>
            </main>

            <BottomNavBar />
        </>

    )

}