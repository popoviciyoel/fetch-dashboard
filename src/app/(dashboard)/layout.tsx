'use client';
import { ReactNode, Suspense } from 'react'
import { Header } from "@/app/(dashboard)/components/header";
import { UserProvider } from "./userProvider";


export default function Layout({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<>Loading Dogs</>}>
            <UserProvider>
                <Header />
                <main>{children}</main>
            </UserProvider>
        </Suspense>

    )
}