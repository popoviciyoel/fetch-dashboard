import { SignOutButton } from "./SignOutButton"
import Image from "next/image"

export const Header = () => {
    return <header style={{ borderBottom: '1px solid #f0f0f0' }} className="sticky top-0 z-50 w-full bg-white">
        <div className="flex h-16 items-center justify-between px-6 w-full">
            <Image src={'/fetch_logo.png'} alt="Logo" width={150} height={75} />

            <SignOutButton />
        </div>
    </header>
}