// types
import type WalletType from '@/dataTypes/Wallet'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
// icons
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
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
            <Tooltip title="Tambah Transaksi" placement="top" arrow>
                <span>
                    <IconButton
                        disabled={disabled}
                        color="success"
                        size="small"
                        onClick={handleCreate}>
                        <PointOfSaleIcon />
                    </IconButton>
                </span>
            </Tooltip>

            <DialogWithTitle title="Tambah Transaksi" open={open} maxWidth="xs">
                <Formik
                    initialValues={{}}
                    initialStatus={data}
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
                    onReset={handleClose}
                    component={WalletTxForm}
                />
            </DialogWithTitle>
        </>
    )
}
