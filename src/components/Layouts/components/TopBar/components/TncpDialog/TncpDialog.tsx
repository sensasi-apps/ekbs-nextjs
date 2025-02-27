// types
import type { FormEvent } from 'react'
// vendors
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
// hooks
import useAuth from '@/providers/Auth'
// components
import { TncpDialogContent } from './components/TncpDialogContent'

export function TncpDialog({
    open,
    handleClose,
}: {
    open: boolean
    handleClose: () => void
}) {
    const { user, onAgreeTncp } = useAuth()

    const { pathname, push } = useRouter()

    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (user && user.is_agreed_tncp === false && pathname !== '/logout') {
            setIsOpen(true)
        }
    }, [user, pathname])

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            setIsLoading(true)

            axios.post(`/users/agree-tcnp`).then(() => {
                setIsOpen(false)
                setIsLoading(false)
                onAgreeTncp()
            })
        },
        [onAgreeTncp],
    )

    return (
        <Dialog open={isOpen || open}>
            <TncpDialogContent />

            <DialogActions>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        setIsOpen(false)
                        handleClose()
                        if (user?.is_agreed_tncp === false) {
                            push('/logout')
                        }
                    }}>
                    {user?.is_agreed_tncp === false
                        ? 'Saya tidak menyetujui Syarat, Ketentuan, dan Kebijakan (logout)'
                        : 'Tutup'}
                </Button>
                {user?.is_agreed_tncp === false && (
                    <form onSubmit={handleSubmit}>
                        <Button
                            loading={isLoading}
                            type="submit"
                            variant="contained">
                            Saya telah membaca dan menyetujui Syarat, Ketentuan,
                            dan Kebijakan Privasi ini
                        </Button>
                    </form>
                )}
            </DialogActions>
        </Dialog>
    )
}
