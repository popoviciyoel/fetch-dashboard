
import { useRouter } from 'next/navigation'

export function SignOutButton() {
    const router = useRouter()
    // In your component:
    const handleSignOut = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Signout failed');

        }



        // Redirect or update UI
        router.push('/login')



    }

    return (
        <button
            onClick={handleSignOut}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 pointer"
        >
            Sign Out
        </button>
    )
} 