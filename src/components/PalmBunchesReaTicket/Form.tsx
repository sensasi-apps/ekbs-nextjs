import React, { FC } from 'react'
import axios from '@/lib/axios'

import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import FormType from '@/components/Global/Form/type'

import PalmBunchesReaDeliveryMainInputs from './Form/MainInputs'
import PalmBunchesReaDeliveryFarmerInputs from './Form/FarmerInputs'
import GradingItemInputs from './Form/GradingItemInputs'
import PalmBuncesReaTicketRegisterAsForm from './Form/RegisterAs'

import useValidationErrors from '@/hooks/useValidationErrors'

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
    const { validationErrors, setValidationErrors, clearByName, clearByEvent } =
        useValidationErrors()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.target as HTMLFormElement

        if (!formEl.reportValidity()) return

        setSubmitting(true)

        try {
            const formData = new FormData(formEl)

            await axios.post(
                `/palm-bunches/rea-tickets${data?.id ? '/' + data?.id : ''}`,
                formData,
            )
            onSubmitted()
        } catch (error: any) {
            if (error?.response.status === 422) {
                setValidationErrors(error?.response.data.errors)
            } else {
                throw error
            }
        } finally {
            setSubmitting(false)
        }
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
                        clearByEvent={clearByEvent}
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

            <PalmBuncesReaTicketRegisterAsForm
                disabled={disabled}
                clearByEvent={clearByEvent}
                validationErrors={validationErrors}
            />

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
