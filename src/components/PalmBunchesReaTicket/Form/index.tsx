import React, { FC } from 'react'
// import moment from 'moment'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import PalmBunchesReaTicketDataType from '@/dataTypes/PalmBunchReaTicket'
import FormType from '@/components/Global/Form/Form.type'

import useValidationErrors from '@/hooks/useValidationErrors'
import PalmBunchesReaDeliveryMainInputs from './MainInputs'
import PalmBunchesReaDeliveryFarmerInputs from './FarmerInputs'
import GradingItemInputs from './GradingItemInputs'

const PalmBuncesReaTicketForm: FC<FormType<PalmBunchesReaTicketDataType>> = ({
    data,
    actionsSlot,
    loading,
    setSubmitting,
    handleClose,
}) => {
    const disabled = Boolean(loading || data?.delivery?.transaction)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.target as HTMLFormElement

        if (!formEl.reportValidity()) return

        setSubmitting(true)

        try {
            const formData = new FormData(formEl)

            await axios.post(
                `/palm-bunches/rea-tickets/${data.id || ''}`,
                formData,
            )
            handleClose()
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

    const { validationErrors, setValidationErrors, clearByName, clearByEvent } =
        useValidationErrors()

    return (
        <form
            id="palm-bunches-rea-deliveries-form"
            autoComplete="off"
            onSubmit={handleSubmit}>
            <Grid container rowSpacing={4}>
                <Grid item xs={12} sm>
                    <PalmBunchesReaDeliveryMainInputs
                        data={data}
                        disabled={disabled}
                        validationErrors={validationErrors}
                        clearByEvent={clearByEvent}
                        clearByName={clearByName}
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
                        data={data?.gradings}
                        disabled={disabled}
                        clearByEvent={clearByEvent}
                        validationErrors={validationErrors}
                    />
                </Grid>
            </Grid>

            <Box my={4}>
                <PalmBunchesReaDeliveryFarmerInputs
                    data={data.delivery?.palm_bunches}
                    disabled={disabled}
                    validationErrors={validationErrors}
                    clearByEvent={clearByEvent}
                    clearByName={clearByName}
                />
            </Box>

            {actionsSlot}
        </form>
    )
}

export default PalmBuncesReaTicketForm
