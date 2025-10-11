// types

// icons
import InfoIcon from '@mui/icons-material/Info'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/GridLegacy'
import dayjs from 'dayjs'
import type { FormEvent } from 'react'
// vendors
import { useState } from 'react'
import type FormType from '@/components/Global/Form/type'
import PalmBunchApiUrlEnum from '@/components/pages/palm-bunch/ApiUrlEnum'
import PalmBunch from '@/enums/permissions/PalmBunch'
// enums
import Role from '@/enums/role'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import useIsAuthHasRole from '@/hooks/use-is-auth-has-role'
import useValidationErrors from '@/hooks/useValidationErrors'
import axios from '@/lib/axios'
import type PalmBunchesReaTicket from '@/modules/palm-bunch/types/orms/palm-bunch-rea-ticket'
import type ActivityLogType from '@/types/orms/activity-log'
import UserActivityLogsDialogTable from '../UserActivityLogs/DialogTable'
import PalmBunchesReaDeliveryFarmerInputs from './Form/FarmerInputs'
// local components
import GradingItemInputs from './Form/GradingItemInputs'
import PalmBunchesReaDeliveryMainInputs from './Form/MainInputs'
import ReaTiketPaymentDetailView from './Form/ReaTiketPaymentDetailView'

export default function PalmBunchesReaTicketForm({
    data,
    actionsSlot,
    loading,
    setSubmitting,
    onSubmitted,
}: FormType<PalmBunchesReaTicket>) {
    const isAuthHasPermission = useIsAuthHasPermission()
    const isAuthHasRole = useIsAuthHasRole()

    const disabled =
        Boolean(loading || (data?.delivery?.transactions?.length || 0) > 0) ||
        !isAuthHasRole([Role.PALM_BUNCH_MANAGER, Role.PALM_BUNCH_ADMIN])

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
                PalmBunchApiUrlEnum.UPDATE_OR_CREATE_TICKET.replace(
                    '$1',
                    data?.id ? `/${data?.id}` : '',
                ),
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
            autoComplete="off"
            id="palm-bunches-rea-deliveries-form"
            onSubmit={handleSubmit}>
            <Grid columnSpacing={2} container rowSpacing={4}>
                <Grid item sm={7} xs={12}>
                    <PalmBunchesReaDeliveryMainInputs
                        clearByName={clearByName}
                        disabled={disabled}
                        validationErrors={validationErrors}
                    />
                </Grid>

                <Grid item sm={5} xs={12}>
                    <GradingItemInputs
                        clearByName={clearByName}
                        disabled={disabled}
                        validationErrors={validationErrors}
                    />
                </Grid>
            </Grid>

            <PalmBunchesReaDeliveryFarmerInputs
                clearByName={clearByName}
                disabled={disabled}
                validationErrors={validationErrors}
            />

            {isAuthHasRole(Role.PALM_BUNCH_MANAGER) && (
                <>
                    <ReaTiketPaymentDetailView data={data} />

                    <FormControlLabel
                        control={
                            <Checkbox
                                defaultChecked={Boolean(data.validated_at)}
                                value="true"
                            />
                        }
                        disabled={disabled}
                        label="Data yang di-input sudah sesuai dengan yang diinginkan"
                        name="validate_now"
                        sx={{ mt: 2 }}
                    />
                </>
            )}

            {data.validated_by_user && (
                <Box component={FormHelperText} mb={2}>
                    Telah divalidasi oleh {data?.validated_by_user.name} pada{' '}
                    {dayjs(data.validated_at).format('DD-MM-YYYY HH:mm')}
                </Box>
            )}

            {!data?.delivery?.transactions?.length &&
                isAuthHasPermission([
                    PalmBunch.CREATE_TICKET,
                    PalmBunch.UPDATE_TICKET,
                ]) &&
                actionsSlot}

            {/* TODO: refactor to permission based */}
            {isAuthHasRole(Role.PALM_BUNCH_MANAGER) &&
                data.id &&
                data.delivery && (
                    <UserActivityLog
                        data={[
                            ...data.delivery.logs,
                            ...data.delivery.palm_bunches.flatMap(
                                palmBunch => palmBunch.logs ?? [],
                            ),
                        ]}
                    />
                )}
        </form>
    )
}

const UserActivityLog = ({ data }: { data: ActivityLogType[] }) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)} startIcon={<InfoIcon />}>
                Riwayat Data
            </Button>
            <UserActivityLogsDialogTable
                data={data}
                open={open}
                setIsOpen={setOpen}
            />
        </>
    )
}
