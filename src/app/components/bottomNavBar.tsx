import Link from "next/link";
import { FaAppleWhole, FaCircleUser, FaHouse, FaMoneyBill, FaReceipt } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { useAuth } from "@/lib/hooks/auth";
export default function BottomNavBar() {
    const router = useRouter();
    const pathname = usePathname()

    const { user, logout } = useAuth({ middleware: 'user' })

    return (
        <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-white border border-gray-200 rounded-full bottom-4 left-1/2 bg-white">
            <div className={'grid h-full max-w-lg ' + (user ? 'grid-cols-5' : 'grid-cols-3') + ' mx-auto'}>
                <Link href="/home" className={`inline-flex flex-col items-center justify-center px-5 rounded-s-full group ${pathname === '/home' ? 'bg-red-100' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <FaHouse />
                    <span className="sr-only">Home</span>
                </Link>

                <Link href='/fruits' className={`inline-flex flex-col items-center justify-center px-5 group ${pathname === '/fruits' ? 'bg-red-100' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <FaAppleWhole />
                    <span className="sr-only">Fruits</span>
                </Link>
                {
                    user ? (
                        <>
                            <Link href='/history' className={`inline-flex flex-col items-center justify-center px-5 group ${pathname === '/history' ? 'bg-red-100' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                <FaReceipt />
                                <span className="sr-only">History</span>
                            </Link>
                            <Link href='/history-debts' className={`inline-flex flex-col items-center justify-center px-5 group ${pathname === '/history-debts' ? 'bg-red-100' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                <FaMoneyBill />
                                <span className="sr-only">History Debts</span>
                            </Link>
                            <Link href='profile' className={`inline-flex flex-col items-center justify-center px-5 rounded-e-full group ${pathname === '/profile' ? 'bg-red-100' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                <FaCircleUser />
                                <span className="sr-only">Profile</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href='/auth/login' className={`inline-flex flex-col items-center justify-center px-5 rounded-e-full group ${pathname === '/profile' ? 'bg-red-100' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                <FaCircleUser />
                                <span className="sr-only">Profile</span>
                            </Link>
                        </>
                    )
                }
            </div>
        </div>
    );
}
