/* eslint-disable @next/next/no-sync-scripts */
'use client';

import { useAuth } from "@/lib/hooks/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input"

import '../../globals.css'
import Link from "next/link";

export default function Page() {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');


    const router = useRouter();

    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)

    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/home',
    })
    const submitHandler = async (event: any) => {
        event.preventDefault()

        register({
            username,
            password,
            email,
            phone,
            setErrors,
            setStatus,
        })
    }

    return (
        <>

            <main className="my-0 mx-auto min-h-full max-w-screen-sm">
                <div
                    style={{ display: "flex", alignItems: "center" }}
                    className=" my-0 mx-auto min-h-screen max-w-480 overflow-x-hidden bg-white flex justify-center pb-[66px]"
                >
                    <div className="px-12 lg:px-5 mt-1 sm:mx-auto sm:w-full sm:max-w-sm" >
                        <h2 className="mb-1 text-center text-lg lg:text-xl font-bold tracking-tight text-gray-900 :text-white">
                            Selamat Datang di Toko Buah Mira !
                        </h2>
                        <h3 className="mb-1 text-center text-m font-light tracking-tight text-gray-900 :text-white">
                            Register untuk membuat Akunmu
                        </h3>                    
                        <form onSubmit={submitHandler} action="" className="mt-10 space-y-2">

                            <Input type="text"
                                className="input input-bordered w-full " onChange={(event) => setUsername(event.target.value)}
                                placeholder="Masukan Username Anda" />

                            <Input type="text"
                                className="input input-bordered w-full " onChange={(event) => setEmail(event.target.value)}
                                placeholder="Masukan Email Anda" />

                            <Input type="text"
                                className="input input-bordered w-full " onChange={(event) => setPhone(event.target.value)}
                                placeholder="Masukan No Telpon Anda" />

                            <Input type="password"
                                className="input input-bordered w-full " onChange={(event) => setPassword(event.target.value)}
                                placeholder="Masukkan Password Anda" />

                            <br />
                            <button
                                type="submit"
                                className="w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                            >
                                Register
                            </button>
                            <div className="divider text-red-200">atau</div>
                            <div className="text-center">
                                Sudah punya akun?{" "}
                                <Link href="/auth/login" className="text-red-600">
                                    Login Sekarang!
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

        </>
    );
}