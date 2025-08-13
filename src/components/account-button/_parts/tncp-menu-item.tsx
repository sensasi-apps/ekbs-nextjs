'use client'

// types
import type { FormEvent } from 'react'
// vendors
import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
// icons
import GradingIcon from '@mui/icons-material/Grading'
// hooks
import useAuthInfoState from '@/hooks/use-auth-info-state'
import TncpDialogContent from './tncp-menu-item.dialog-content'
// components

export default function TncpMenuItem() {
    const [authInfo, setAuthInfo] = useAuthInfoState()

    const { push } = useRouter()
    const pathname = usePathname()

    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (
            authInfo &&
            authInfo.is_agreed_tncp === false &&
            pathname !== '/logout'
        ) {
            setIsOpen(true)
        }
    }, [authInfo, pathname])

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (authInfo) {
                setIsLoading(true)

                axios.post(`/users/agree-tcnp`).then(() => {
                    setIsOpen(false)
                    setIsLoading(false)

                    setAuthInfo({
                        ...authInfo,
                        is_agreed_tncp: true,
                    })
                })
            }
        },
        [authInfo, setAuthInfo],
    )

    if (!authInfo) return null

    return (
        <MenuItem onClick={() => setIsOpen(true)}>
            <ListItemIcon>
                <GradingIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText>
                Syarat, Ketentuan, dan Kebijakan Privasi
            </ListItemText>

            <Dialog open={isOpen}>
                <TncpDialogContent />

                <DialogActions>
                    <Button
                        disabled={isLoading}
                        onClick={() => {
                            setIsOpen(false)

                            if (authInfo.is_agreed_tncp === false) {
                                push('/logout')
                            }
                        }}>
                        {authInfo.is_agreed_tncp === false
                            ? 'Saya tidak menyetujui Syarat, Ketentuan, dan Kebijakan (logout)'
                            : 'Tutup'}
                    </Button>

                    {authInfo.is_agreed_tncp === false && (
                        <form onSubmit={handleSubmit}>
                            <Button
                                loading={isLoading}
                                type="submit"
                                variant="contained">
                                Saya telah membaca dan menyetujui Syarat,
                                Ketentuan, dan Kebijakan Privasi ini
                            </Button>
                        </form>
                    )}
                </DialogActions>
            </Dialog>
        </MenuItem>
    )
}
