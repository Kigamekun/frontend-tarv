'use client';

import { useAuth } from "@/lib/hooks/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function FruitPage() {

    const router = useRouter()
    const { user, logout } = useAuth({ middleware: 'user' })
    const [fruitData, setFruitData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [fruit, setFruit] = useState({
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
        setFruit({ ...fruit, [name]: value });
    }



    const getFruitData = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits`, {
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

    const createFruit = async (e : any) => {
        e.preventDefault();

        var bodyFormData = new FormData();
        console.log(selectedFile);
        if (selectedFile) {
            bodyFormData.append('image', selectedFile);
        }
        bodyFormData.append('name', fruit.name);
        bodyFormData.append('stock', fruit.stock.toString());
        bodyFormData.append('price', fruit.price.toString());
        bodyFormData.append('description', fruit.description);
        bodyFormData.append('category_id', fruit.category_id.toString());
        var res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits/add`,
            bodyFormData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            }
        )
            .then(function (response) {
                getFruitData();

                setFruit({
                    id: 0,
                    name: '',
                    stock: 0,
                    price: 0,
                    description: '',
                    image: '',
                    category_id: 0
                })
                e.target.reset();

                // close modal
                const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                if (modal) {
                    modal.close();
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

    const editFruit = async (id: number) => {

       

        let fr = fruitData.find((f) => f.id === id);
        console.log(fr)
        setFruit({
            id: fr.id,
            name: fr.name,
            stock: fr.stock,
            price: fr.price,
            description: fr.description,
            image: fr.image,
            category_id: 1

        });
        showModal()
    }


    const updateFruit = async (e : any) => {


        e.preventDefault();
        var bodyFormData = new FormData();
        console.log(selectedFile);

        if (selectedFile) {
            bodyFormData.append('image', selectedFile);
        }

        bodyFormData.append('name', fruit.name);
        bodyFormData.append('stock', fruit.stock.toString());
        bodyFormData.append('price', fruit.price.toString());
        bodyFormData.append('description', fruit.description);
        bodyFormData.append('category_id', fruit.category_id.toString());

        var res = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits/update/${fruit.id}`,
            {
                name: fruit.name,
                stock: fruit.stock,
                price: fruit.price,
                description: fruit.description,
                category_id: 1
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
                setFruit({
                    id: 0,
                    name: '',
                    stock: 0,
                    price: 0,
                    description: '',
                    image: '',
                    category_id: 0
                })
                e.target.reset();

                // close modal
                const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                if (modal) {
                    modal.close();
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


    const deleteFruit = async (id: number) => {
        var res = await axios.delete(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits/delete/${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
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

    const showModal = () => {
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }

    const showModalCreate = () => {
        setFruit({
            id: 0,
            name: '',
            stock: 0,
            price: 0,
            description: '',
            image: '',
            category_id: 0
        })
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }

    const modalHide = () => {
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
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
                            <h6 className="dark:text-white">Fruits Table</h6>
                            <button className="btn btn-info text-white" onClick={() => showModalCreate()}>Create</button>

                        </div>
                        <div className="flex-auto px-0 pt-0 pb-2">
                            <div className="p-5 overflow-x-auto">
                                <table className="items-center w-full mb-0 align-top border-collapse dark:border-white/40 text-slate-500">
                                    <thead className="align-bottom">
                                        <tr>
                                            <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Buah
                                            </th>
                                            <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Stok
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Harga
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Kategori
                                            </th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none dark:border-white/40 dark:text-white text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-collapse border-solid shadow-none dark:border-white/40 dark:text-white tracking-none whitespace-nowrap text-slate-400 opacity-70" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fruitData.map((fruit, index) => (
                                            <>
                                                <tr>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <div className="flex px-2 py-1">
                                                            <div>
                                                                <img
                                                                    src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + fruit.image}
                                                                    className="inline-flex items-center justify-center mr-4 text-sm text-white transition-all duration-200 ease-in-out h-9 w-9 rounded-xl"
                                                                    alt="user1"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col justify-center">
                                                                <h6 className="mb-0 text-sm leading-normal dark:text-white">
                                                                    {fruit.name}
                                                                </h6>
                                                                <p className="mb-0 text-xs leading-tight dark:text-white dark:opacity-80 text-slate-400">
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <p className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-80">
                                                            {fruit.stock}
                                                        </p>

                                                    </td>
                                                    <td style={{ textAlign: 'center' }} className="p-2 text-align-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <p style={{ textAlign: 'center' }} className="mb-0 text-xs font-semibold leading-tight dark:text-white dark:opacity-80">
                                                            Rp. {fruit.price}
                                                        </p>

                                                    </td>
                                                    <td className="p-2 text-sm leading-normal text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <span className="bg-gradient-to-tl  px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-slate-400">
                                                            Buah Buahan
                                                        </span>
                                                    </td>
                                                    <td className="p-2 text-sm leading-normal text-center align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <span className="bg-gradient-to-tl from-emerald-500 to-teal-400 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
                                                            Muncul
                                                        </span>
                                                    </td>
                                                    <td className=" align-middle bg-transparent border-b dark:border-white/40 whitespace-nowrap shadow-transparent">
                                                        <button

                                                            className="btn btn-warning text-white text-xs font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400"
                                                            onClick={() => editFruit(fruit.id)}
                                                        >

                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteFruit(fruit.id)}

                                                            className="ms-3 btn btn-danger text-xs font-semibold leading-tight dark:text-white dark:opacity-80 text-slate-400"
                                                        >
                                                            {" "}
                                                            Delete{" "}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}




                                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                                        <dialog id="my_modal_1" className="modal">
                                            <div className="modal-box">
                                                <h3 className="font-bold text-lg">Buat Data Buah</h3>
                                                <div className="modal-action">
                                                    <form method="dialog" onSubmit={ (fruit.id == 0) ? createFruit : updateFruit }>

                                                        <input className="input input-bordered w-full mt-5 " value={fruit.name} type="text" name="name" placeholder="Name" onChange={handleInputChange} />
                                                        <input className="input input-bordered w-full mt-5 " value={fruit.stock} type="text" name="stock" placeholder="Stock" onChange={handleInputChange} />
                                                        <input className="input input-bordered w-full mt-5 " value={fruit.price} type="text" name="price" placeholder="Price" onChange={handleInputChange} />
                                                        <input className="input input-bordered w-full mt-5 " value={fruit.description} type="text" name="description" placeholder="Description" onChange={handleInputChange} />
                                                        {/* <input className="input input-bordered w-full mt-5 " value={fruit.category_id} type="text" name="category_id" placeholder="Category ID" onChange={handleInputChange} /> */}
                                                        <input className="file-input input-bordered w-full mt-5 " type="file" onChange={handleFileSelect} />

                                                        <div className="mt-5 flex justify-end gap-3">
                                                            <button className="btn" type="button" onClick={modalHide}>Close</button>
                                                            {(fruit.id == 0) ? (
                                                                <button type="submit" className="btn">Create</button>
                                                            ) : (
                                                                <button type="submit" className="btn">Update</button>
                                                            )}
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </dialog>

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