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



export default function Page({ params }: { params: { id: string } }) {
  const cartItems = useSelector((state: RootState) => state.cart);

  const dispatch = useDispatch();

  const router = useRouter()
  // const { user, logout } = useAuth({ middleware: 'user' })
  const [fruitData, setFruitData] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);

  const [cart, setCart] = useState([]);

  const getFruitData = async () => {
    var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits/${params.id}`, {
      headers: {
        'content-type': 'text/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(function (response) {
        console.log(response.data);
        setFruitData(response.data.data);
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

  const increaseQuantity = () => {
    dispatch(incrementQuantity(Number(params.id)));
    setQuantity(quantity + 1);

  }

  const decreaseQuantity = () => {

    if (cartItems.find((item: { id: number; }) => item.id == Number(params.id)).quantity === 1) {
      dispatch(removeFromCart(Number(params.id)));
      setQuantity(1);
    } else {
      dispatch(decrementQuantity(Number(params.id)));
      setQuantity(quantity - 1);
    }
  }

  useEffect(() => {
    getFruitData();

    let targetItem = cartItems.find((item: any) => item.id == params.id);
    if (targetItem) {
      setQuantity(targetItem.quantity);
    }
  }, []);

  return (

    <>
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
                  <center>Detail Produk</center>
                </div>
                <div className="col-span-4" />
              </div>
              <br />
              <div>
                <div
                  className="wrapper-hero h-full"
                  style={{ position: "relative"}}
                >
                  <center>
                    <div className="relative inset-x-0 mx-auto">
                      <img
                        src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + fruitData[0]?.image}
                        style={{ width: "90%", zIndex: -1, marginLeft: 10 }}
                        className="rounded-lg "
                        alt=""
                      />
                    </div>
                    <div
                      className="block border inset-x-0 mx-auto w-4/5 relative -top-16 z-100 p-6 bg-white rounded-lg shadow "
                      style={{
                        borderRadius: 30,                                                                                                                     
                      }}
                    >
                      <h5
                        className="mb-2 text-2xl font-bold text-black "
                        style={{ textAlign: "left" }}
                      >
                        {fruitData[0]?.name}
                      </h5>
                      <div
                        className="flex"
                        style={{ justifyContent: "space-between" }}
                      >
                        <h5
                          className="mb-2 text-md  text-black "
                          style={{ textAlign: "left" }}
                        >
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
                <p>
                  {fruitData[0]?.description}
                </p>
                <br />
                <h3 className="font-bold text-lg">
                  <i className="fa-regular fa-lightbulb me-2" /> Varian
                </h3>
                <div className="flex gap-3">
                  <span
                    style={{ fontSize: 12 }}
                    className="bg-white mt-3 text-[#a2a2a2] border-2 text-xs font-medium me-2 px-8 py-3 rounded-full :bg-red-900 :text-red-300"
                  >
                    Buah Buahan
                  </span>
                </div>
                <br />
                <br />
                {/* <h3 className="font-bold text-lg">
                  <i className="fa-regular fa-lightbulb me-2" /> Detail
                </h3>
                <br />
                <ul className="max-w-xl divide-y divide-gray-200 dark:divide-gray-700">
                  <li className="pb-3 pt-3 pr-2 pl-2 sm:pb-4">
                    <div className="flex" style={{ justifyContent: "space-between" }}>
                      <div className="flex-1">Kategori</div>
                      <div className="flex-1" style={{ textAlign: "right" }}>
                        Tropis
                      </div>
                    </div>
                  </li>
                  <hr />
                </ul> */}
                <h3 className="font-bold text-lg"> Jumlah</h3>
                <br />
                <div className="flex">
                  <div className="flex-1">
                    <div className="flex gap-4 items-center">
                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        className="focus:outline-none text-lg bold text-[#DC1F26] bg-white border-2 border-[#DC1F26] focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-4 :bg-red-600 :hover:bg-red-700 :focus:ring-red-900"
                      >
                        -
                      </button>
                      <span style={{ fontSize: 30 }}>{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        type="button"
                        className="focus:outline-none text-lg bold text-white bg-[#DC1F26] border-2 border-[#DC1F26] focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-4 :bg-red-600 :hover:bg-red-700 :focus:ring-red-900"
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

    </>
  )
}