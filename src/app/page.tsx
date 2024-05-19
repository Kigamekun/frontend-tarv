'use client'

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
    const [fruitData, setFruitData] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);


    const getFruitData = async (searchQuery: any) => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits`, {
            params: { search: searchQuery },
            headers: {
                'content-type': 'text/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                setFruitData(response.data.data);
            }).catch(function (error) {
                if (error.response && error.response.status === 401) {
                    Swal.fire({
                        icon: 'error',
                        title: error.response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })

                    // logout()

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
        // if (!user) return;
        getFruitData('');
        // }, [user]);
    }, []);

    return (
        <>
            <>

                {/* Navbar */}

                <nav className={`bg-white ${isOpen ? "ps-4" : "p-4"} lg:p-4 flex justify-between items-center fixed top-0 w-full z-10 h-16`}>
                    <a href="#" className="flex items-center ml-8 lg:ml-10 cursor-pointer">
                        <span className="text-red-600 text-2xl font-landing font-bold">Frutaria</span>
                    </a>
                    <div className="block lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`flex items-center ${isOpen ? "" : "px-4" } py-2 rounded text-black-500 hover:text-black-400`}
                        >
                            <svg
                                className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{color: "red"}}
                            >
                                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                            </svg>
                            <svg
                                className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"                                
                            >
                                <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                            </svg>
                        </button>
                    </div>
                    <div className={`block items-center justify-between h-16 lg:flex lg:items-center lg:w-auto ${isOpen ? "block" : "hidden"}`} >
                        <div className="bg-white hover:bg-red-100 cursor-pointer h-full flex items-center pl-4 focus:font-bold hover:font-bold">
                            <a href="#home" className="text-red-600 mr-4 font-landing">Home</a>
                        </div>
                        <div className="bg-white hover:bg-red-100 cursor-pointer h-full flex items-center pl-4 focus:font-bold hover:font-bold">
                            <a href="#tentang" className="text-red-600 mr-4 font-landing">Tentang Kami</a>
                        </div>
                        <div className="bg-white hover:bg-red-100 cursor-pointer h-full flex items-center pl-4 focus:font-bold hover:font-bold">
                            <a href="#detail" className="text-red-600 mr-4 font-landing">Detail</a>
                        </div>
                        <div className="bg-white hover:bg-red-100 cursor-pointer h-full flex items-center pl-4 focus:font-bold hover:font-bold">
                            <a href="#belanja" className="text-red-600 mr-4 font-landing">Belanja</a>
                        </div>
                        <Link className="bg-white cursor-pointer h-full flex items-center focus:font-bold hover:font-bold" href="/home">
                            <button
                                className="bg-white hover:bg-red-500 text-red-500 hover:text-white font-semibold py-2 px-4 lg:border lg:border-red-500 lg:rounded-full">Dashboard
                            </button>
                        </Link>
                    </div>
                </nav>

                {/* Hero */}
                <div id="home" className="bg-cover bg-center h-screen relative" style={{ backgroundImage: 'url("assets/img/b1.jpg")' }}>
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
                        <h1 className="text-3xl px-5 lg:text-5xl font-landing font-bold mb-2 lg:mb-6">Beli Buah Segar & Organik Hanya di Frutaria</h1>
                        <p className="text-xl px-5 font-landing mb-6">Dapatkan buah-buahan terbaik langsung dari kebun</p>
                        <div className="flex space-x-4">
                            <Link href="#belanja">
                                <button className="bg-white hover:bg-red-500 hover:text-white text-red-500 font-landing font-semibold py-3 px-8 rounded-full transition duration-300">Belanja Sekarang</button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Know About Us */}

                <section id="tentang" className="py-20 pl-4 bg-gray-100">
                    <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center">
                        <div className="lg:w-1/2 lg:mr-10">
                            <h2 className="text-3xl lg:text-5xl font-landing font-bold mb-4">Toko <span className="text-red-500">Buah</span>
                            </h2>
                            <p className="font-landing text-gray-700 mb-8 font-landing">Selamat Datang di Mira Buah!</p>
                            <p className="font-landing text-gray-700 mb-8 font-landing">Kami dengan bangga menyajikan koleksi buah segar berkualitas tinggi untuk memenuhi kebutuhan nutrisi harian Anda. Dari salak yang renyah hingga duku yang manis, kami menawarkan beragam pilihan buah lokal segar terbaik. Nikmati kelezatan alami buah-buahan dengan berbelanja di Mira Buah!</p>
                        </div>
                        <div className="lg:w-1/2">
                            <div className="w-full h-auto">
                                <img src="assets/img/pasar.jpg" alt="pasar" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Details */}

                <section id="detail" className="py-16 bg-white">
                    <div className="container mx-auto w-11/12">
                        <h2 className="text-3xl lg:text-5xl font-landing text-center font-bold my-16"><span className="text-red-500">Detail</span></h2>
                        {fruitData.slice(0, 10).map((fruit, id) => (
                            <div key={id} className="flex flex-col lg:flex-row items-center mb-24 bg-red-50 p-6 lg:p-12 rounded-xl">
                                <div className={id % 2 == 0 ? "grow-0 lg:w-3/10 order-1 lg:order-2 mb-4 lg:mb-0" : "grow-0 lg:w-3/10 mb-4 lg:mb-0"}>
                                    <img src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + fruit.image} alt="Detail 1" className="w-full lg:h-72 lg:w-96 object-cover rounded-3xl" />
                                </div>
                                <div className={id % 2 == 0 ? "w-full lg:w-7/10 order-2 lg:order-1 lg:px-8" : "w-full lg:w-7/10 lg:px-8"}>
                                    <h3 className={id % 2 == 0 ? "text-2xl lg:text-4xl font-bold mb-8 text-center lg:text-left" : "text-2xl lg:text-4xl font-bold mb-8 text-center lg:text-right"}>Buah <span className="text-red-500">{fruit.name}</span></h3>
                                    <p className="text-gray-700 text-justify">
                                        {fruit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>


                {/* Belanja */}

                <section id="belanja" className="py-16 px-4 bg-gray-100">
                    <div className="container mx-auto text-center">
                        <h2 className="text-5xl font-landing font-bold mb-8 text-red-500">Belanja</h2>

                        <div className="slider flex flex-wrap justify-center gap-2 p-4">
                            {fruitData.map((fruit, id) => (
                                <div key={id}
                                    className="card w-60 p-4 bg-white rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 mb-4">
                                    <img src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + fruit.image} alt="Buah 1"
                                        className="w-full h-40 object-cover mb-4 rounded-lg" />
                                    <h3 className="text-lg font-landing font-semibold mb-2">{fruit.name}</h3>
                                    {/* <div className="flex items-center justify-center mb-2">
                                        <div className="font-landing text-gray-600">{fruit.description.length < 22 ? fruit.description : (fruit.description.slice(0,22)+'...')}</div>
                                    </div> */}
                                    <div className="font-landing text-gray-700 mb-2">Rp {fruit.price} / kg</div>
                                    <div className="font-landing text-gray-500">Stock : {fruit.stock == 0 ? 'Habis' : fruit.stock}</div>
                                    <Link href={`/home/${fruit.id}`}>
                                        <button className="bg-red-500 hover:bg-red-700 font-landing text-white py-2 px-4 text-sm rounded-full mt-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2"
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M2 5a1 1 0 011-1h14a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5zm0 5a1 1 0 011-1h14a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1zm0 5a1 1 0 011-1h14a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            Detail
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}

                <footer className="py-8 bg-white text-red-950">
                    <div className="container mx-auto flex flex-wrap">

                        {/* Kolom ke 1 */}
                        <div className="w-full lg:w-2/5 px-4">
                            <h3 className="text-4xl font-landing font-bold mb-4">Toko <span className="text-red-500">Buah</span></h3>
                            <p className="font-landing text-red-950 mb-4">Selamat Datang di Mira Buah!</p>
                            <p className="font-landing text-red-950 mb-4">Kami dengan bangga menyajikan koleksi buah segar berkualitas tinggi untuk memenuhi kebutuhan nutrisi harian Anda. Dari salak yang renyah hingga duku yang manis, kami menawarkan beragam pilihan buah lokal segar terbaik. Nikmati kelezatan alami buah-buahan dengan berbelanja di Mira Buah!</p>
                        </div>

                        {/* Kolom ke 2 */}
                        <div className="w-full lg:w-1/5 px-4">
                            <h3 className="text-xl font-landing font-bold mb-4">Hubungi Kami</h3>
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M11.807 1.58a1 1 0 011.354.438l1.83 3.66a1 1 0 01-.438 1.354l-1.322.661A10 10 0 0120 12.77l.661 1.322a1 1 0 01-1.354 1.354l-1.322-.661A10 10 0 0112.77 20l-1.322.661a1 1 0 01-1.354-1.354l.661-1.322a10 10 0 01-6.718-6.718l-.661 1.322a1 1 0 01-1.354.438l-1.83-3.66A1 1 0 013.231 3.23l1.83-3.66a1 1 0 011.354-.438L6.5 1.579A10 10 0 0111.807 1.58zm2.194 1.183a1 1 0 00-1.354.437l-1.567 3.134a8 8 0 00-5.364 5.364l-3.134 1.567a1 1 0 00-.437 1.354l.437.874a1 1 0 001.354.437l1.567-.783a8 8 0 005.364-5.364l.783-1.567a1 1 0 00-.437-1.354l-.874-.437a1 1 0 00-.437 1.354l.437.874a6 6 0 01-4.049 4.049l-.874-.437a1 1 0 00-1.354.437l-.783 1.567a8 8 0 005.364 5.364l1.567-.783a1 1 0 00.437-1.354l-.437-.874a1 1 0 00-1.354-.437l-1.567.783a6 6 0 01-4.049-4.049l.783-1.567a1 1 0 00-.437-1.354l-.874-.437a1 1 0 00-.437 1.354l.437.874a8 8 0 005.364 5.364l1.567-.783a1 1 0 00.437-1.354l-.437-.874a1 1 0 00-1.354-.437l-1.567.783a6 6 0 01-4.049-4.049l.783-1.567a1 1 0 00-.437-1.354l-.874-.437z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span className="font-landing">+62 812 3456 7890</span>
                            </div>
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M3 5a3 3 0 013-3h8a3 3 0 013 3v10a3 3 0 01-3 3H6a3 3 0 01-3-3V5zm2-2a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H5z"
                                        clip-rule="evenodd" />
                                    <path d="M10 12a1 1 0 100-2 1 1 0 000 2z" />
                                </svg>
                                <span className="font-landing">tokobuah@gmail.com</span>
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 2a8 8 0 018 8c0 2.21-.9 4.21-2.36 5.66l-.01-.01-.01.01a8.023 8.023 0 01-11.28 0l-.01-.01-.01.01A7.97 7.97 0 012 10a8 8 0 018-8zm-1 13.155V14a1 1 0 011-1h2a1 1 0 011 1v1.155a6.982 6.982 0 00-4 0zM12.5 13a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 4a6 6 0 00-6 6c0 1.58.63 3.02 1.66 4.08l.01-.01.01.01a6.02 6.02 0 008.66 0l.01-.01.01.01A6.01 6.01 0 0016 10a6 6 0 00-6-6zm1 10V14a1 1 0 00-1-1H8a1 1 0 00-1 1v1.155a7 7 0 101 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span className="font-landing">12.00 - 15.00</span>
                            </div>
                            <div className="flex items-center mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 2a8 8 0 018 8c0 2.21-.9 4.21-2.36 5.66l-.01-.01-.01.01a8.023 8.023 0 01-11.28 0l-.01-.01-.01.01A7.97 7.97 0 012 10a8 8 0 018-8zm-1 13.155V14a1 1 0 011-1h2a1 1 0 011 1v1.155a6.982 6.982 0 00-4 0zM12.5 13a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM10 4a6 6 0 00-6 6c0 1.58.63 3.02 1.66 4.08l.01-.01.01.01a6.02 6.02 0 008.66 0l.01-.01.01.01A6.01 6.01 0 0016 10a6 6 0 00-6-6zm1 10V14a1 1 0 00-1-1H8a1 1 0 00-1 1v1.155a7 7 0 101 0z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span className="font-landing">Pasar Ngemplak Tulungagung</span>
                            </div>
                        </div>
                        <div className="w-full lg:w-2/5 px-5 mt-3 lg:mt-0 lg:pl-10">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.4569673611477!2d111.8920062!3d-8.0547816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78e349cfdfe4e5%3A0x59536af26c29079b!2sPasar%20Ngemplak%20Tulungagung!5e0!3m2!1sid!2sid!4v1715670557416!5m2!1sid!2sid" width="100%" height="90%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </footer>
            </>

        </>
    );
}
