// types
import type { ProductOpnameMovementType } from '@/dataTypes/ProductMovement'
import type { OnRowClickType } from '@/components/Datatable'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import { Formik } from 'formik'
// components
import Datatable, { getDataRow, mutate } from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import ProductOpanmeForm, {
    EMPTY_FORM_DATA,
    EMPTY_FORM_STATUS,
} from '@/components/pages/farm-input-product-opnames/Form'
// icons
import ChecklistIcon from '@mui/icons-material/Checklist'
// providers
import useAuth from '@/providers/Auth'
// utils
import errorCatcher from '@/utils/errorCatcher'
import { ApiUrlEnum } from '@/components/pages/farm-input-product-in-outs/Datatable.type'
import { DATATABLE_COLUMNS } from '@/components/pages/farm-input-product-in-outs/Datatable'
import ProductType from '@/dataTypes/Product'
// import formikOnSubmitConsole from '@/utils/formikOnSubmitConsole'

export default function FarmInputProductOpnames() {
    const { userHasPermission } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] =
        useState(EMPTY_FORM_DATA)
    const [initialFormikStatus, setInitialFormikStatus] =
        useState(EMPTY_FORM_STATUS)

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const productMovement =
                getDataRow<ProductOpnameMovementType>(dataIndex)
            if (!productMovement) return

            const products = productMovement.product_movementable.products_state

            const opnameMovementDetails = productMovement.details.map(pmd => {
                const product = products.find(
                    product => product.id === pmd.product_id,
                )

                return {
                    ...pmd,
                    product: { ...product } as ProductType,
                    physical_qty: (product?.qty ?? 0) + pmd.qty,
                }
            })

            setInitialFormikValues({
                at: productMovement.product_movementable.at,
                note: productMovement.product_movementable.note,
                product_opname_movement_details: opnameMovementDetails,
            })

            setInitialFormikStatus(productMovement)

            setIsDialogOpen(true)
        }
    }

    const handleNew = () => {
        setInitialFormikValues(EMPTY_FORM_DATA)
        setInitialFormikStatus(EMPTY_FORM_STATUS)
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const isNew = !initialFormikStatus?.uuid

    return (
        <AuthLayout title="Opname Stok">
            <Datatable
                title="Riwayat"
                tableId="farm-input-product-opname-table"
                apiUrl={ApiUrlEnum.OPNAME}
                onRowClick={handleRowClick}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'at', direction: 'desc' }}
            />

            <DialogWithTitle
                title={(isNew ? 'Tambah ' : 'Perbaharui ') + 'Data Opname Stok'}
                open={isDialogOpen}
                maxWidth="sm">
                <Formik
                    initialValues={initialFormikValues}
                    initialStatus={initialFormikStatus}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(`farm-inputs/product-opnames`, values)
                            .then(() => {
                                mutate()
                                handleClose()
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }
                    onReset={handleClose}
                    component={ProductOpanmeForm}
                />
            </DialogWithTitle>

            {userHasPermission([
                'create product purchase',
                'update product purchase',
            ]) && (
                <Fab onClick={handleNew}>
                    <ChecklistIcon />
                </Fab>
            )}
        </AuthLayout>
    )
}
