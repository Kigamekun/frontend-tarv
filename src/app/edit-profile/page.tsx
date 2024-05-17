

'use client'

import { useSelector, useDispatch } from 'react-redux';
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
import { FaArrowLeft, FaMinus, FaPlus } from 'react-icons/fa6';
import Link from "next/link";
import { decrementQuantity, incrementQuantity, removeFromCart } from '@/lib/redux/cart.slice';
import BottomNavBar from '../components/bottomNavBar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from "@/lib/hooks/auth";

interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    birth: string;
    phone: string;
    gender: string;
}

const EditProfile = () => {

    const [isClient, setIsClient] = useState(false)
    const [userData, setUserData] = useState<User | null>(null);

    const { user, logout } = useAuth({ middleware: 'user' })


    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [birth, setBirth] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [gender, setGender] = useState<string>('');

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleBirthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setBirth(event.target.value);
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(event.target.value);
    };

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setGender(event.target.value); 
    };

    const confirmProfile = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

        const dateObj = new Date(birth);
        const year = dateObj.getFullYear();
        const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        const day = ("0" + dateObj.getDate()).slice(-2);
        const formattedDate = `${year}-${month}-${day}`;

        const raw = JSON.stringify({
            "name": name,
            "phone": phone,
            "birth": formattedDate,
            "gender": gender,
        });

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/user/update/${userData?.id}`, {
            method: "PUT",
            headers: myHeaders,
            body: raw,
        })
            .then((response) => response.text())
            .then((result) => {
            })
            .catch((error) => console.error(error));
    }

    const getUserInfo = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/me`, {
            headers: {
                'content-type': 'text/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(function (response) {
                console.log('test', response.data.data);
                setUserData(response.data.data);
                setName(response.data.data.name);
                setPhone(response.data.data.phone);
                setBirth(response.data.data.birth);
                setGender(response.data.data.gender);

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
        setIsClient(true)
        if (!user) return;
        getUserInfo()
        console.log(userData)
    }, [user])



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
                                    <div className="col-span-4 text-black font-bold">
                                        <i className="fa-solid fa-arrow-left" />
                                    </div>
                                    <div className="col-span-4 text-xl text-black font-bold font-body">
                                        <center>Edit Profile</center>
                                    </div>
                                    <div className="col-span-4" />
                                </div>
                                <div>
                                    <div className="wrapper-hero" style={{ height: 600 }}>
                                        <center>
                                            <form action="">
                                                <div
                                                    className="block p-6 font-body bg-white rounded-lg shadow w-4/5 my-10"
                                                >
                                                    <div className="">
                                                        <div className="w-40 h-40 relative group">
                                                            <label title="Click to upload" htmlFor="file_input">
                                                                <img
                                                                    className="rounded-full group-hover:brightness-50"
                                                                    src="assets/img/Asset1@3x-100.jpg"
                                                                />
                                                                <div className="w-40 h-40 rounded-full flex justify-center place-items-center absolute top-0">
                                                                    <i
                                                                        className="fa-solid fa-camera fa-lg invisible group-hover:visible"
                                                                        style={{ color: "white" }}
                                                                    />
                                                                </div>
                                                            </label>
                                                            <input
                                                                hidden={true}
                                                                type="file"
                                                                name="file_input"
                                                                id="file_input"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col text-gray-600 space-y-2 mb-5 mt-5">
                                                        <div className="flex items-center gap-2">
                                                            <label htmlFor="nama" className="w-1/3 text-left">
                                                                Nama
                                                            </label>
                                                            <input
                                                                id="nama"
                                                                type="text"
                                                                className="flex-auto rounded-md p-2 bg-gray-100"
                                                                placeholder="Masukkan namamu"
                                                                defaultValue={(userData && userData.name) ?? ''}
                                                                onChange={handleNameChange}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <label htmlFor="hp" className="w-1/3 text-left">
                                                                No HP
                                                            </label>
                                                            <input
                                                                id="hp"
                                                                type="text"
                                                                className="flex-auto rounded-md p-2 bg-gray-100"
                                                                placeholder="Masukkan No HP mu"
                                                                defaultValue={userData && userData.phone ? userData.phone : ''}
                                                                onChange={handlePhoneChange}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-3 mt-3">
                                                            <label htmlFor="tlahir" className="w-1/3 text-left">
                                                                Tanggal Lahir
                                                            </label>
                                                            <input
                                                                id="tlahir"
                                                                type="date"
                                                                className="flex-auto rounded-md p-2 bg-gray-100"
                                                                defaultValue={userData && userData.birth ? new Date(userData.birth).toISOString().split('T')[0] : ''}
                                                                onChange={handleBirthChange}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <label htmlFor="" className="w-1/3 text-left">
                                                                Jenis Kelamin
                                                            </label>
                                                            <div className="flex-auto">
                                                                <div className="flex justify-start gap-1">
                                                                    <input
                                                                        id="jk1"
                                                                        name="jk"
                                                                        type="radio"
                                                                        className="rounded-md p-2 bg-gray-100"
                                                                        value="pria"
                                                                        checked={gender == "pria"}
                                                                        onChange={handleGenderChange}
                                                                    />
                                                                    <label htmlFor="jk1">Laki-laki</label>
                                                                </div>
                                                                <div className="flex justify-start gap-1">
                                                                    <input
                                                                        id="jk2"
                                                                        name="jk"
                                                                        type="radio"
                                                                        className="rounded-md p-2 bg-gray-100"
                                                                        value="wanita"
                                                                        checked={gender == "wanita"}
                                                                        onChange={handleGenderChange}
                                                                    />
                                                                    <label htmlFor="jk2">Perempuan</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button type='button'  onClick={confirmProfile} className="w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                                        Simpan
                                                    </button>
                                                </div>
                                            </form>
                                        </center>
                                    </div>
                                </div>
                            </div>
                            <br />
                        </div>
                    </main>




                    <BottomNavBar />

                </>


            ) : 'Prerendered'}
        </>
    );
};

export default EditProfile;


