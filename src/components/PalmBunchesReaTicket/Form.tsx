import { FC, FormEvent } from 'react'
import axios from '@/lib/axios'

import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import FormType from '@/components/Global/Form/type'

import PalmBunchesReaDeliveryMainInputs from './Form/MainInputs'
import PalmBunchesReaDeliveryFarmerInputs from './Form/FarmerInputs'
import GradingItemInputs from './Form/GradingItemInputs'

import useValidationErrors from '@/hooks/useValidationErrors'

const remapData = (data: PalmBunchesReaTicketType) => {
    const remappedData: any = { ...data }

    remappedData.to_oil_mill_code = data.delivery.to_oil_mill_code
    remappedData.courier_user_uuid = data.delivery.courier_user?.uuid
    remappedData.vehicle_no = data.delivery.vehicle_no
    remappedData.from_position = data.delivery.from_position

    if (data.delivery.from_position === 'Lainnya') {
        remappedData.determined_rate_rp_per_kg =
            data.delivery.determined_rate_rp_per_kg || undefined
    }
    remappedData.n_bunches = data.delivery.n_bunches

    remappedData.palm_bunches = data.delivery.palm_bunches
    remappedData.gradings = data.gradings.map(grading => ({
        id: grading.id,
        item_id: grading.item.id,
        value: grading.value,
    }))

    return remappedData
}

const PalmBuncesReaTicketForm: FC<FormType<PalmBunchesReaTicketType>> = ({
    data,
    actionsSlot,
    loading,
    setSubmitting,
    onSubmitted,
}) => {
    const disabled = Boolean(
        loading || (data?.delivery?.transactions?.length || 0) > 0,
    )

    const { validationErrors, setValidationErrors, clearByName } =
        useValidationErrors()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget

        if (!formEl.reportValidity()) return

        setSubmitting(true)

        const formData = remapData(data)

        axios
            .post(
                `/palm-bunches/rea-tickets${data?.id ? '/' + data?.id : ''}`,
                formData,
            )
            .then(() => {
                onSubmitted()
            })
            .catch(error => {
                if (error?.response?.status === 422) {
                    return setValidationErrors(error?.response.data.errors)
                }
            })
            .finally(() => setSubmitting(false))
    }

    return (
        <form
            id="palm-bunches-rea-deliveries-form"
            autoComplete="off"
            onSubmit={handleSubmit}>
            <Grid container rowSpacing={4}>
                <Grid item xs={12} sm>
                    <PalmBunchesReaDeliveryMainInputs
                        validationErrors={validationErrors}
                        clearByName={clearByName}
                        disabled={disabled}
                    />
                </Grid>

                <Divider
                    sx={{
                        mx: 4,
                    }}
                    orientation="vertical"
                    flexItem
                />

                <Grid item xs={12} sm>
                    <GradingItemInputs
                        disabled={disabled}
                        clearByName={clearByName}
                        validationErrors={validationErrors}
                    />
                </Grid>
            </Grid>

            <PalmBunchesReaDeliveryFarmerInputs
                disabled={disabled}
                validationErrors={validationErrors}
                clearByName={clearByName}
            />

            {!data?.delivery?.transactions?.length && actionsSlot}
        </form>
    )
}

export default PalmBuncesReaTicketForm
