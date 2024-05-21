'use client';

import { useAuth } from "@/lib/hooks/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrementQuantity, incrementQuantity, removeFromCart } from "@/lib/redux/cart.slice";
import BottomNavBar from "@/app/components/bottomNavBar";

interface CartState {
  id: number;
  name: string;
  quantity: number;
  image: string;
  price: number;
}

interface RootState {
  cart: CartState[];
}

export default function Page({ params }: { params: { id: string } }) {
  const cartItems = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const [fruitData, setFruitData] = useState<any>({});
  const [quantity, setQuantity] = useState(1);

  const getFruitData = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits/${params.id}`, {
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFruitData(response.data.data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error terjadi',
        text: 'Mohon coba lagi nanti.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleAddToCart = () => {
    const existingItem = cartItems.find((item) => item.id === fruitData[0].id);

    if (existingItem) {
      dispatch(incrementQuantity(fruitData[0].id));
    } else {
      dispatch(addToCart({
        id: fruitData[0].id,
        quantity: quantity,
        image: fruitData[0].image,
        name: fruitData[0].name,
        price: fruitData[0].price,
      }));
    }

    Swal.fire({
      icon: 'success',
      title: 'Berhasil ditaruh di keranjang',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    if (cartItems.some((item) => item.id === fruitData[0].id)) {
      dispatch(incrementQuantity(fruitData[0].id));
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      if (cartItems.some((item) => item.id === fruitData[0].id)) {
        dispatch(decrementQuantity(fruitData[0].id));
      }
    } else if (quantity === 1) {
      dispatch(removeFromCart(fruitData[0].id));
      setQuantity(1);
    }
  };

  useEffect(() => {
    getFruitData();
    const targetItem = cartItems.find((item) => item.id === parseInt(params.id));
    if (targetItem) {
      setQuantity(targetItem.quantity);
    }
  }, [params.id, cartItems]);

  return (
    <>
      <main className="my-0 mx-auto min-h-full max-w-screen-sm">
        <div className="my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white pb-[66px]">
          <div className="p-4">
            <br />
            <div className="grid grid-flow-row-dense grid-cols-12 grid-rows-1" style={{ height: 50 }}>
              <Link href={`/home`} className="col-span-4 text-black font-bold">
                <FaArrowLeft />
              </Link>
              <div className="col-span-4 text-xl text-black font-bold">
                <center>Detail Produk</center>
              </div>
              <div className="col-span-4" />
            </div>
            <br />
            <div>
              <div className="wrapper-hero h-full" style={{ position: "relative" }}>
                <center>
                  <div className="relative inset-x-0 mx-auto">
                    <img
                      src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + fruitData[0]?.image}
                      style={{ width: "90%", zIndex: -1, marginLeft: 10 }}
                      className="rounded-lg"
                      alt=""
                    />
                  </div>
                  <div className="block border inset-x-0 mx-auto w-4/5 relative -top-16 z-100 p-6 bg-white rounded-lg shadow" style={{ borderRadius: 30 }}>
                    <h5 className="mb-2 text-2xl font-bold text-black" style={{ textAlign: "left" }}>
                      {fruitData[0]?.name}
                    </h5>
                    <div className="flex" style={{ justifyContent: "space-between" }}>
                      <h5 className="mb-2 text-md text-black" style={{ textAlign: "left" }}>
                        Rp. {fruitData[0]?.price} / Kg
                      </h5>
                      <div>
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star checked" />
                        <span className="fa fa-star" />
                        <span className="fa fa-star" />
                      </div>
                    </div>
                  </div>
                </center>
              </div>
            </div>
            <div className="text-black mx-auto w-4/5">
              <h3 className="font-bold text-lg">Deskripsi</h3>
              <br />
              <p>{fruitData[0]?.description}</p>
              <br />
              <h3 className="font-bold text-lg">
                <i className="fa-regular fa-lightbulb me-2" /> Varian
              </h3>
              <div className="flex gap-3">
                <span className="bg-white mt-3 text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full">
                  Buah Buahan
                </span>
              </div>
              <br />
              <br />
              <h3 className="font-bold text-lg">Jumlah</h3>
              <br />
              <div className="flex">
                <div className="flex-1">
                  <div className="flex gap-4 items-center">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      className="focus:outline-none text-lg bold text-[#DC1F26] bg-white border-2 hover:bg-slate-200 border-[#DC1F26] focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-4"
                    >
                      -
                    </button>
                    <span style={{ fontSize: 30 }}>{quantity}</span>
                    <button
                      onClick={increaseQuantity}
                      type="button"
                      className="focus:outline-none text-lg bold text-white bg-[#DC1F26] hover:bg-red-700 border-2 border-[#DC1F26] focus:ring-4 focus:ring-red-300 font-medium rounded-lg px-5 py-4"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex-1" style={{ textAlign: "right" }}>
                  <h3>Stok</h3>
                  <p>{fruitData[0]?.stock}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="text-white bg-[#DC1F26] focus:ring-4 focus:ring-blue-300 w-full mt-24 font-bold hover:bg-red-700 text-sm rounded px-2 py-1 lg:rounded-lg lg:text-lg lg:px-5 lg:py-2.5 lg:me-2 lg:mb-2"
              >
                Tambah ke Keranjang
              </button>
            </div>
            <br />
            <br />
            <br />
          </div>
          <br />
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
