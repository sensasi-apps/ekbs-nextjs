import { useState } from 'react'

import axios from '@/lib/axios'

import Button from '@mui/material/Button'

const VerifyEmail = () => {
    // const { logout, resendEmailVerification } = useAuth({
    //     middleware: 'auth',
    //     redirectIfAuthenticated: '/dashboard',
    // })

    const resendEmailVerification = ({ setStatus }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const [status, setStatus] = useState(null)

    return (
        <>
            <div className="mb-4 text-sm text-gray-600">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you did not receive the email, we will gladly send you
                another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <div className="mt-4 flex items-center justify-between">
                <Button onClick={() => resendEmailVerification({ setStatus })}>
                    Resend Verification Email
                </Button>

                <button
                    type="button"
                    className="underline text-sm text-gray-600 hover:text-gray-900">
                    Logout
                </button>
            </div>
        </>
    )
}

export default VerifyEmail
