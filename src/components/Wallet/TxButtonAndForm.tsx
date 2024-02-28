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
import handle422 from '@/utils/errorCatcher'
import WalletTxForm from './TxForm'

export default function WalletTxButtonAndForm({
    data,
    onSubmit = () => {},
}: {
    data: WalletType
    onSubmit?: () => void
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
                <IconButton color="success" size="small" onClick={handleCreate}>
                    <PointOfSaleIcon />
                </IconButton>
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
