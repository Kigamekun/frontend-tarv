'use client'

import '@/app/admin/assets/css/argon-dashboard-tailwind.css';
import '@/app/admin/assets/css/nucleo-icons.css';
import '@/app/admin/assets/css/nucleo-svg.css';
import '@/app/admin/assets/css/argon-dashboard-tailwind.css';
import Script from 'next/script';
import Sidebar from '@/app/admin/components/sidebar';
import Navbar from '@/app/admin/components/navbar';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {


    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
      setIsClient(true)
    }, [])
 
    return <h1>{isClient ? 
        <>
        
        <Script
                src="/static/assets/js/plugins/chartjs.min.js"
                strategy="lazyOnload"

            />
            <Script
                src="/static/assets/js/plugins/perfect-scrollbar.min.js"
                strategy="lazyOnload"

            />
            <Script
                src="/static/assets/js/argon-dashboard-tailwind.js"
                strategy="lazyOnload"

            />

            <div className="absolute w-full bg-blue-500 dark:hidden min-h-75" />
            {/* sidenav  */}
            <Sidebar />
            {/* end sidenav */}
            <main className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68 rounded-xl">
                {/* Navbar */}
                <Navbar />
                {/* end Navbar */}
                {/* cards */}
                <div className="w-full px-6 py-6 mx-auto " style={{minHeight:'100vh'}}>
                    {children}
                </div>
                {/* end cards */}
            </main>
            {/* plugin for charts  */}
            {/* plugin for scrollbar  */}
            {/* main script file  */}
        </>
        
        : ''}</h1>

}