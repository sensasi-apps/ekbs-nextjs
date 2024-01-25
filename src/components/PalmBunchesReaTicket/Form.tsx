// types
import type { FormEvent } from 'react'
import type PalmBunchesReaTicketType from '@/dataTypes/PalmBunchReaTicket'
import type FormType from '@/components/Global/Form/type'
import type ActivityLogType from '@/dataTypes/ActivityLog'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
// local components
import PalmBunchesReaDeliveryMainInputs from './Form/MainInputs'
import PalmBunchesReaDeliveryFarmerInputs from './Form/FarmerInputs'
import GradingItemInputs from './Form/GradingItemInputs'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
import UserActivityLogsDialogTable from '../UserActivityLogs/DialogTable'
import useAuth from '@/providers/Auth'
import Role from '@/enums/Role'

export default function PalmBuncesReaTicketForm({
    data,
    actionsSlot,
    loading,
    setSubmitting,
    onSubmitted,
}: FormType<PalmBunchesReaTicketType>) {
    const { userHasRole } = useAuth()

    const disabled =
        Boolean(loading || (data?.delivery?.transactions?.length || 0) > 0) ||
        !userHasRole([Role.PALM_BUNCH_MANAGER, Role.PALM_BUNCH_ADMIN])

    const { validationErrors, setValidationErrors, clearByName } =
        useValidationErrors()

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget

        if (!formEl.reportValidity()) return

        setSubmitting(true)

        const formData = new FormData(formEl)
        const atDmy = formData.get('at')
        const atDayJs = dayjs(atDmy as string, 'DD-MM-YYYY')
        formData.set('at', atDayJs.format('YYYY-MM-DD'))

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

            {userHasRole(Role.PALM_BUNCH_MANAGER) && (
                <UserActivityLog data={data.delivery.logs} />
            )}
        </form>
    )
}

const UserActivityLog = ({ data }: { data: ActivityLogType[] }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>Riwayat Data</Button>
            <UserActivityLogsDialogTable
                open={open}
                setIsOpen={setOpen}
                data={data}
            />
        </>
    )
}
