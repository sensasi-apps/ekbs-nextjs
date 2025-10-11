// types

// icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
// materials
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import axios from '@/lib/axios'
import type WalletType from '@/types/orms/wallet'
// utils
import handle422 from '@/utils/handle-422'
import WalletTxForm from './TxForm'

export default function WalletTxButtonAndForm({
    data,
    onSubmit = () => {},
    disabled,
}: {
    data: WalletType
    onSubmit?: () => void
    disabled?: boolean
}) {
    const [open, setOpen] = useState(false)

    function handleCreate() {
        setOpen(true)
    }

    function handleClose() {
        setOpen(false)
    }

    return (
        <>
            <Tooltip arrow placement="top" title="Tambah Transaksi">
                <span>
                    <IconButton
                        color="success"
                        disabled={disabled}
                        onClick={handleCreate}
                        size="small">
                        <PointOfSaleIcon />
                    </IconButton>
                </span>
            </Tooltip>

            <DialogWithTitle maxWidth="xs" open={open} title="Tambah Transaksi">
                <Formik
                    component={WalletTxForm}
                    initialStatus={data}
                    initialValues={{}}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `wallets/user/${data.uuid}/transactions`,
                                values,
                            )
                            .then(() => {
                                onSubmit()
                                handleClose()
                            })
                            .catch(error => handle422(error, setErrors))
                    }
                />
            </DialogWithTitle>
        </>
    )
}
