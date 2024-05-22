"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/lib/hooks/auth"
import axios from "axios"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

interface Fruit {
    id: number;
    name: string;
    stock: number;
    price: number;
    description: string;
    image: string;
    category_id: number;
}


export default function DataTableDemo() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
        image: false,

        })
    const [rowSelection, setRowSelection] = React.useState({})

    const router = useRouter()
    const { user, logout } = useAuth({ middleware: 'user' })
    const [fruitData, setFruitData] = React.useState<Fruit[]>([]);
    const [selectedFile, setSelectedFile] = React.useState<File>();
    const [fruit, setFruit] = React.useState({
        id: 0,
        name: '',
        stock: 0,
        price: 0,
        description: '',
        image: '',
        category_id: 0
    });


    const columns: ColumnDef<Fruit>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                
                <div className="flex px-2 py-1">
                <div>
                    <img
                        src={process.env.NEXT_PUBLIC_ASSETS_HOST + '/' + row.getValue('image')}
                        className="inline-flex items-center justify-center mr-4 text-sm text-white transition-all duration-200 ease-in-out h-9 w-9 rounded-xl"
                        alt="user1"
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <h6 className="mb-0 text-sm leading-normal dark:text-white">
                        {row.getValue("name")}
                    </h6>
                    <p className="mb-0 text-xs leading-tight dark:text-white dark:opacity-80 text-slate-400">
                    </p>
                </div>
            </div>
            ),
        },
        {
            accessorKey: "stock",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        stock
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("stock")}</div>,
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("price")}</div>,
        },
        {
            accessorKey: 'category_id',
            header: 'Category',
            cell: info => 'Buah Buahan',
        },
        {
            accessorKey: 'image',
            header: 'image',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'id',
            header: 'Actions',
            cell: info => (
                <div>
                    <button className="btn btn-warning text-white text-xs" onClick={() => editFruit(Number(info.getValue()))}>Edit</button>
                    <button className="btn btn-danger text-xs ml-2" onClick={() => deleteFruit(Number(info.getValue()))}>Delete</button>
                </div>
            ),
        }
    ];

    const table = useReactTable({
        data: fruitData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })




    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0])
    }


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    const createFruit = async (e: any) => {
        e.preventDefault();

        Swal.fire({
            title: 'Loading...',
            target: document.getElementById('my_modal_1'),
            text: 'Mohon tunggu sebentar...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

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
        if (fr) {
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
    }


    const updateFruit = async (e: any) => {


        e.preventDefault();
        Swal.fire({
            title: 'Loading...',
            target: document.getElementById('my_modal_1'),
            text: 'Mohon tunggu sebentar...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
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

        Swal.fire({
            title: 'Loading...',
            target: document.getElementById('my_modal_1'),
            text: 'Mohon tunggu sebentar...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

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
                const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
                if (modal) {
                    modal.showModal();
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
                    }, 1700)
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

    React.useEffect(() => {
        console.log(`ini token ${localStorage.getItem('token')}`)

        if (localStorage.getItem('token') == null) {
            Swal.fire({
                icon: 'error',
                title: 'Anda tidak memiliki akses',
                showConfirmButton: false,
                timer: 1500
            })
            setTimeout(() => {
                window.location.href = '/home'
            }, 1700)
        }

        if (!user) return;
        getFruitData();
        getUserInfo();
    }, [user]);


    return (
        <>
            {user ? (
                <div className="flex flex-wrap -mx-3">
                    <div className="flex-none w-full max-w-full px-3">
                        <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                            <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent flex justify-between">
                                <h6 className="dark:text-white">Management Buah</h6>
                                <button className="btn btn-info text-white" onClick={() => showModalCreate()}>Create</button>

                            </div>
                            <div className="flex-auto px-0 pt-0 pb-2">
                                <div className="p-5 overflow-x-auto">
                                    <div className="flex items-end w-full py-4">
                                        <Input
                                            placeholder="Filter nama buah..."
                                            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                            onChange={(event) =>
                                                table.getColumn("name")?.setFilterValue(event.target.value)
                                            }
                                            className="max-w-sm"
                                        />

                                    </div>
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                {table.getHeaderGroups().map((headerGroup) => (
                                                    <TableRow key={headerGroup.id}>
                                                        {headerGroup.headers.map((header) => {
                                                            return (
                                                                <TableHead key={header.id}>
                                                                    {header.isPlaceholder
                                                                        ? null
                                                                        : flexRender(
                                                                            header.column.columnDef.header,
                                                                            header.getContext()
                                                                        )}
                                                                </TableHead>
                                                            )
                                                        })}
                                                    </TableRow>
                                                ))}
                                            </TableHeader>
                                            <TableBody>
                                                {table.getRowModel().rows?.length ? (
                                                    table.getRowModel().rows.map((row) => (
                                                        <TableRow
                                                            key={row.id}
                                                            data-state={row.getIsSelected() && "selected"}
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell key={cell.id}>
                                                                    {flexRender(
                                                                        cell.column.columnDef.cell,
                                                                        cell.getContext()
                                                                    )}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={columns.length}
                                                            className="h-24 text-center"
                                                        >
                                                            No results.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-end space-x-2 py-4">
                                        <div className="flex-1 text-sm text-muted-foreground">
                                            {table.getFilteredSelectedRowModel().rows.length} of{" "}
                                            {table.getFilteredRowModel().rows.length} row(s) selected.
                                        </div>
                                        <div className="space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>




                                    {/* Open the modal using document.getElementById('ID').showModal() method */}
                                    <dialog id="my_modal_1" className="modal">
                                        <div className="modal-box">
                                            <h3 className="font-bold text-lg">Buat Data Buah</h3>
                                            <div className="modal-action">
                                                <form method="dialog" onSubmit={(fruit.id == 0) ? createFruit : updateFruit}>

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

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : ""}
        </>
    )
}
