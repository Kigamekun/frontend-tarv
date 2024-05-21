'use client';

import { useAuth } from "@/lib/hooks/auth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
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

interface Transaction {
    kode_transaksi: string;
    nama_user: string;
    user_anonim: string;
    total: number;
    metode_pembayaran: string;
    status_pembayaran: string;
    tanggal_transaksi: string;
}


export default function TransactionPage() {

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({
            image: false,

        })
    const [rowSelection, setRowSelection] = useState({})


    const router = useRouter()
    const { user, logout } = useAuth({ middleware: 'user' })
    const [transactionData, setFruitData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [transaction, setFruit] = useState({
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
        setFruit({ ...transaction, [name]: value });
    }



    const getFruitData = async () => {
        var res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/hutang-transaction`, {
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




    const createFruit = async () => {
        var bodyFormData = new FormData();
        console.log(selectedFile);

        if (selectedFile) {
            bodyFormData.append('image', selectedFile);
        }

        bodyFormData.append('name', transaction.name);
        bodyFormData.append('stock', transaction.stock.toString());
        bodyFormData.append('price', transaction.price.toString());
        bodyFormData.append('description', transaction.description);
        bodyFormData.append('category_id', transaction.category_id.toString());




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

    const changeStatusTransaction = async (event: ChangeEvent<HTMLSelectElement>, kode_transaksi: string) => {
        var res = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/transaction/change-status/${kode_transaksi}`,
            {
                status_pembayaran: event.target.value
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
        let fr = transactionData.find((f) => f.id === id);
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


    const updateFruit = async () => {
        var bodyFormData = new FormData();
        console.log(selectedFile);

        if (selectedFile) {
            bodyFormData.append('image', selectedFile);
        }

        bodyFormData.append('name', transaction.name);
        bodyFormData.append('stock', transaction.stock.toString());
        bodyFormData.append('price', transaction.price.toString());
        bodyFormData.append('description', transaction.description);
        bodyFormData.append('category_id', transaction.category_id.toString());

        var res = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_HOST}/fruits/update/${transaction.id}`,
            {
                name: transaction.name,
                stock: transaction.stock,
                price: transaction.price,
                description: transaction.description,
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




    const showModal = () => {
        const modal = document.getElementById('my_modal_1') as HTMLDialogElement;
        if (modal) {
            modal.showModal();
        }
    }



    const columns: ColumnDef<Transaction>[] = [
        // {
        //     accessorKey: 'kode_transaksi',
        //     header: 'Kode Transaksi',
        //     cell: info => <Link href={`/admin/transactions/${info.getValue()}`}>{info.getValue('kode_transaksi')}</Link>
        // },
        {
            accessorKey: "kode_transaksi",
            header: 'Kode Transaksi',
            cell: ({ row }) => (
                <>
                    <Link href={`/admin/transactions/${row.getValue('kode_transaksi')}`}>{row.getValue('kode_transaksi')}</Link>
                </>
            ),
        },

        {
            accessorKey: 'nama_user',
            header: 'User',
            cell: info => info.row.original.nama_user || info.row.original.user_anonim,
            filterFn: (row, id, filterValues) => {
                const userInfoString = [
                    row.original.nama_user,
                    row.original.user_anonim,
                ].filter(Boolean).join(' ');
    
                let searchTerms = Array.isArray(filterValues) ? filterValues : [filterValues];
    
                // Check if any of the search terms are included in the userInfoString
                return searchTerms.some(term => userInfoString.includes(term.toLowerCase()));
            },
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: info => `Rp. ${info.getValue()}`
        },
        {
            accessorKey: 'metode_pembayaran',
            header: 'Metode Pembayaran',
        },
        {
            accessorKey: 'status_pembayaran',
            header: 'Status Pembayaran',

            cell: ({ row }) => (
                <>
                    <select className="form-select p-2 rounded" value={row.getValue('status_pembayaran')} onChange={(event) => changeStatusTransaction(event, row.original.kode_transaksi)}>
                        <option value='pending'>Pending</option>
                        <option value='lunas'>Lunas</option>
                    </select>
                </>
            ),
        },
        {
            accessorKey: 'status',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: info => (
                info.row.original.status_pembayaran === 'lunas' ? (
                    <span className="bg-gradient-to-tl from-emerald-500 to-teal-400 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">Lunas</span>
                ) : (
                    <span className="bg-gradient-to-tl from-slate-600 to-slate-300 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">Pending</span>
                )
            )
        },
        {
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tanggal Transaksi
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            accessorKey: 'tanggal_transaksi',
        }
    ];


    const table = useReactTable({
        data: transactionData,
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


    useEffect(() => {

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
                                <h6 className="dark:text-white">Management Hutang</h6>
                                {/* <button className="btn btn-info text-white" onClick={() => showModal()}>Create</button> */}

                            </div>
                            <div className="flex-auto px-0 pt-0 pb-2">
                                <div className="p-5 overflow-x-auto">
                                    <div className="flex items-end w-full py-4">
                                        <Input
                                            placeholder="Filter nama user..."
                                            value={(table.getColumn("nama_user")?.getFilterValue() as string) ?? ""}
                                            onChange={(event) =>
                                                table.getColumn("nama_user")?.setFilterValue(event.target.value)
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


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : ''}

        </>
    );
}