'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FaAppleWhole } from "react-icons/fa6";
import { useAuth } from '@/lib/hooks/auth';
import Swal from 'sweetalert2';

const Sidebar = () => {
    // State untuk melacak halaman yang sedang aktif

    const [activePage, setActivePage] = useState<string>('');
    const [breadcrumb, setBreadcrumb] = useState<string>('');

    const router = useRouter();
    const pathname = usePathname()
    const { user, logout } = useAuth({ middleware: 'user' })

    const onClickLogout = () => {
        Swal.fire({
            title: "Anda yakin?",
            text: "Anda akan logout!",
            icon: "warning",
            showCancelButton: true,
            // confirmButtonColor: "#6A9944",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                logout(); // Execute the logout function
            } else {
                Swal.fire("Cancelled", "Logout cancelled", "error");
            }
        });
    };

    useEffect(() => {
        setActivePage(pathname || 'dashboard');
        setBreadcrumb(pathname || 'dashboard');
        console.log(pathname)
    }, [pathname]);


    return (
        <aside
            className="fixed inset-y-0 flex-wrap items-center justify-between block w-full p-0 my-4 overflow-y-auto antialiased transition-transform duration-200 -translate-x-full bg-white border-0 shadow-xl dark:shadow-none dark:bg-slate-850 max-w-64 ease-nav-brand z-990 xl:ml-6 rounded-2xl xl:left-0 xl:translate-x-0"
            aria-expanded="false"
        >
            <div className="h-19">
                <i
                    className="absolute top-0 right-0 p-4 opacity-50 cursor-pointer fas fa-times dark:text-white text-slate-400 xl:hidden"
                    sidenav-close=""
                />
                <a href="/home" >
                    <div
                        className={`block px-8 py-6 m-0 text-sm whitespace-nowrap dark:text-white text-slate-700 ${activePage === 'dashboard' ? 'bg-blue-500/13 font-semibold' : ''}`}
                        onClick={() => setActivePage('dashboard')}
                    >
                        <span className="ml-1 font-semibold transition-all duration-200 ease-nav-brand">
                            Frutaria
                        </span>
                    </div>
                </a>
            </div>
            <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent" />
            <div className="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
                <ul className="flex flex-col pl-0 mb-0">
                    <li className="mt-0.5 w-full">
                        <Link href="/admin" passHref>
                            <div
                                className={`py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold transition-colors ${activePage === 'dashboard' ? 'bg-blue-500/13 dark:text-white dark:opacity-80' : 'dark:text-white dark:opacity-80'}`}
                                onClick={() => setActivePage('dashboard')}
                            >
                                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                                    <i className="relative top-0 text-sm leading-normal text-blue-500 ni ni-tv-2" />
                                </div>
                                <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
                                    Dashboard
                                </span>
                            </div>
                        </Link>
                    </li>
                    {/* Menambahkan item menu lainnya */}
                    <MenuItem
                        icon="ni ni-tv-2"
                        title="Manajemen Buah"
                        href="/admin/fruits"
                        activePage={activePage}
                        setActivePage={setActivePage}
                        setBreadcrumb={setBreadcrumb}

                    />
                    <MenuItem
                        icon="ni ni-tv-2"
                        title="Manajemen Transaksi"
                        href="/admin/transactions"
                        activePage={activePage}
                        setActivePage={setActivePage}
                        setBreadcrumb={setBreadcrumb}
                    />
                    {/* <MenuItem
                        icon="ni ni-tv-2"
                        title="Manajemen User"
                        href="/admin/users"
                        activePage={activePage}
                        setActivePage={setActivePage}
                    /> */}
                    <MenuItem
                        icon="ni ni-tv-2"
                        title="Data Hutang"
                        href="/admin/debts"
                        activePage={activePage}
                        setActivePage={setActivePage}
                        setBreadcrumb={setBreadcrumb}

                    />
                    <li className="mt-0.5 w-full cursor-pointer">
                        <div
                            className={`py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold transition-colors dark:text-white dark:opacity-80}`}
                            onClick={onClickLogout}
                        >
                            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                                <i className={`relative top-0 text-sm leading-normal text-blue-500 ni ni-tv-2`} />
                            </div>
                            <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
                                Logout
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </aside>
    );
};
``
interface MenuItemProps {
    icon: string;
    title: string;
    href: string;
    activePage: string;
    setActivePage: (page: string) => void;
    setBreadcrumb: (page: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, href, activePage, setActivePage, setBreadcrumb }) => {
    return (
        <li className="mt-0.5 w-full">
            <Link
                href={href}
                passHref
            >
                <div
                    className={`py-2.7 text-sm ease-nav-brand my-0 mx-2 flex items-center whitespace-nowrap rounded-lg px-4 font-semibold transition-colors ${activePage === href.toLowerCase() ? 'bg-blue-500/13 dark:text-white dark:opacity-80' : 'dark:text-white dark:opacity-80'}`}
                    onClick={() => {
                        setActivePage(href.toLowerCase());
                        setBreadcrumb('ads');
                    }
                    }
                >
                    <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-center stroke-0 text-center xl:p-2.5">
                        <i className={`relative top-0 text-sm leading-normal text-blue-500 ${icon}`} />
                    </div>
                    <span className="ml-1 duration-300 opacity-100 pointer-events-none ease">
                        {title}
                    </span>
                </div>
            </Link>
        </li>
    );
}


export default Sidebar;