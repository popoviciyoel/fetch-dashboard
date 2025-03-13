import { SignOutButton } from "./SignOutButton"
import Image from "next/image"

export const Header = () => {
    return <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center justify-between px-6 w-full">
            <Image src={'/fetch_logo.png'} alt="Logo" width={200} height={100} />

            <SignOutButton />
        </div>
    </header>
}