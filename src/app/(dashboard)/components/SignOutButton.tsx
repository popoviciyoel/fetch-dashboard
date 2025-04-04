
import { useRouter } from 'next/navigation'
import { Button } from 'antd'

export function SignOutButton() {
    const router = useRouter()
    
    const handleSignOut = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Signout failed');

        }
        // Redirect to Login
        router.push('/login')
    }

    return (
        <Button
            onClick={handleSignOut}
            type="default"
        >
            Sign Out
        </Button>
    )
} 