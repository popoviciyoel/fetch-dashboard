'use client';

import { Header } from "@/components/header";
import { UserProvider } from "../userProvider";


export default function Layout({ children }) {
    return (
        <UserProvider>

            <Header />
            {/* <Navbar /> */}
            <main>{children}</main>
            {/* <Footer /> */}
        </UserProvider>

    )
}