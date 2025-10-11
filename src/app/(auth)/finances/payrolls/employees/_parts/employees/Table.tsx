// icons
import SettingsIcon from '@mui/icons-material/Settings'
import VisibilityIcon from '@mui/icons-material/Visibility'
// materials
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import dayjs from 'dayjs'
import { Formik } from 'formik'
// vendors
import { useState } from 'react'
// enums
import FinanceApiUrlEnum from '@/app/(auth)/finances/_enums/api-url'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import IconButton from '@/components/IconButton'
import PrintHandler from '@/components/PrintHandler'
import axios from '@/lib/axios'
import type Payroll from '@/types/orms/payroll'
import type PayrollUser from '@/types/orms/payroll-user'
import handle422 from '@/utils/handle-422'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import PayrollEmployeeDetailsForm, { type FormikValues } from './DetailForm'
import PayrollSlip from './Table/PayrollSlip'

export default function PayrollsEmployeesTable({
    data,
    loading,
    mutate,
}: {
    data: Payroll | undefined
    loading: boolean
    mutate: () => void
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [initialFormikValues, setInitialFormikValues] =
        useState<FormikValues>({})
    const [initialFormikStatus, setInitialFormikStatus] =
        useState<PayrollUser>()

    const handleClose = () => {
        setIsDialogOpen(false)
    }

    const handleOpen = (data: PayrollUser) => {
        setInitialFormikValues({
            details: [...(data.details ?? [])].sort((a, b) =>
                a.seq_no > b.seq_no ? 1 : -1,
            ),
        })
        setInitialFormikStatus(data)
        setIsDialogOpen(true)
    }

    const payrollUuid = data?.uuid as string
    const payrollUserUuid = initialFormikStatus?.uuid as string
    const isFinished = Boolean(data?.processed_by_user_uuid)

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Nama</TableCell>
                            <TableCell>Posisi</TableCell>
                            <TableCell>Rincian</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {(loading || !data) && (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    {loading && (
                                        <>
                                            <Skeleton />
                                            <Skeleton />
                                            <Skeleton />
                                            <Skeleton />
                                        </>
                                    )}

                                    {!loading && 'Tidak ada data'}
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading &&
                            data?.users &&
                            data.users
                                .sort((a, b) =>
                                    a.user_state.name.toLowerCase() >
                                    b.user_state.name.toLowerCase()
                                        ? 1
                                        : -1,
                                )
                                .map((payrollUser, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {payrollUser.user_state.id}
                                        </TableCell>
                                        <TableCell>
                                            {payrollUser.user_state.name}
                                        </TableCell>
                                        <TableCell>
                                            {
                                                payrollUser.user_state.employee
                                                    ?.position
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <ul
                                                style={{
                                                    margin: 0,
                                                    paddingLeft: '1em',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {[
                                                    ...(payrollUser.details ??
                                                        []),
                                                ]
                                                    .sort((a, b) =>
                                                        a.seq_no > b.seq_no
                                                            ? 1
                                                            : -1,
                                                    )
                                                    .map(detail => (
                                                        <li key={detail.uuid}>
                                                            {detail.name}:{' '}
                                                            <Box
                                                                color={
                                                                    detail.amount_rp <
                                                                    0
                                                                        ? 'error.main'
                                                                        : undefined
                                                                }
                                                                component="span">
                                                                {numberToCurrency(
                                                                    detail.amount_rp,
                                                                )}
                                                            </Box>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                color:
                                                    payrollUser.final_rp_cache <
                                                    0
                                                        ? 'error.main'
                                                        : undefined,
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {numberToCurrency(
                                                payrollUser.final_rp_cache,
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <PrintHandler
                                                documentTitle={`${
                                                    !isFinished
                                                        ? 'Pratinjau '
                                                        : ''
                                                }Slip Gaji #
                                                    ${payrollUser.user_state.id} — ${
                                                        payrollUser.user_state
                                                            .name
                                                    } — ${dayjs().format(
                                                        'YYYYMMDDHHmmss',
                                                    )}`}
                                                onAfterPrint={() => {
                                                    history.back()
                                                }}
                                                onBeforePrint={async () => {
                                                    history.pushState(
                                                        null,
                                                        '',
                                                        '/finances/payrolls/employees/detail/' +
                                                            payrollUser.uuid,
                                                    )
                                                }}
                                                slotProps={{
                                                    printButton: {
                                                        children:
                                                            isFinished ? undefined : ( // default
                                                                <VisibilityIcon />
                                                            ),
                                                        size: 'small',
                                                    },
                                                    tooltip: {
                                                        title: isFinished
                                                            ? 'Cetak Slip Gaji'
                                                            : 'Pratinjau',
                                                    },
                                                }}>
                                                <PayrollSlip
                                                    data={payrollUser}
                                                    isPreview={!isFinished}
                                                    payrollData={data}
                                                />
                                            </PrintHandler>
                                            {!isFinished && (
                                                <IconButton
                                                    icon={SettingsIcon}
                                                    onClick={() =>
                                                        handleOpen(payrollUser)
                                                    }
                                                    size="small"
                                                    title="Atur"
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5}>Total Bersih</TableCell>

                            <TableCell>
                                {numberToCurrency(
                                    data?.users?.reduce(
                                        (acc, user) =>
                                            acc + user.final_rp_cache,
                                        0,
                                    ) ?? 0,
                                )}
                            </TableCell>

                            <TableCell />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>

            {data && (
                <DialogWithTitle
                    maxWidth="sm"
                    open={isDialogOpen}
                    title="Rincian">
                    <Formik
                        initialStatus={initialFormikStatus}
                        initialValues={initialFormikValues}
                        onReset={handleClose}
                        onSubmit={(values, { setErrors }) =>
                            axios
                                .post(
                                    FinanceApiUrlEnum.CREATE_PAYROLL_USER_DETAILS.replace(
                                        '$payrollUuid',
                                        payrollUuid,
                                    ).replace(
                                        '$payrollUserUuid',
                                        payrollUserUuid,
                                    ),
                                    {
                                        details: values.details?.map(
                                            (detail, i) => ({
                                                ...detail,
                                                seq_no: i,
                                            }),
                                        ),
                                    },
                                )
                                .then(() => {
                                    mutate()
                                    handleClose()
                                })
                                .catch(error => handle422(error, setErrors))
                        }>
                        {({ setErrors, ...props }) => (
                            <PayrollEmployeeDetailsForm
                                {...props}
                                handleDelete={() => {
                                    setDeleting(true)

                                    return axios
                                        .delete(
                                            FinanceApiUrlEnum.DELETE_PAYROLL_USER.replace(
                                                '$payrollUuid',
                                                payrollUuid,
                                            ).replace(
                                                '$payrollUserUuid',
                                                payrollUserUuid,
                                            ),
                                        )
                                        .then(() => {
                                            mutate()
                                            handleClose()
                                        })
                                        .catch(error =>
                                            handle422(error, setErrors),
                                        )
                                        .finally(() => {
                                            setDeleting(false)
                                        })
                                }}
                                isDeleting={deleting}
                                setErrors={setErrors}
                            />
                        )}
                    </Formik>
                </DialogWithTitle>
            )}
        </>
    )
}
