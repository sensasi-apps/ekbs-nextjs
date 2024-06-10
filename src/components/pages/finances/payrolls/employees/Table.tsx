import type Payroll from '@/dataTypes/Payroll'
import type PayrollUser from '@/dataTypes/PayrollUser'
// vendors
import { useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
import dynamic from 'next/dynamic'
// materials
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
// import TableFooter from '@mui/material/TableFooter'
const TableFooter = dynamic(() => import('@mui/material/TableFooter'))
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import PayrollSlip from './Table/PayrollSlip'
// icons
import SettingsIcon from '@mui/icons-material/Settings'
import VisibilityIcon from '@mui/icons-material/Visibility'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import PayrollEmployeeDetailsForm, { FormikValues } from './DetailForm'
import IconButton from '@/components/IconButton'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import handle422 from '@/utils/errorCatcher'
// enums
import FinanceApiUrlEnum from '../../ApiUrlEnum'
import dayjs from 'dayjs'
import PrintHandler from '@/components/PrintHandler'

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
                                                            {numberToCurrency(
                                                                detail.amount_rp,
                                                            )}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {numberToCurrency(
                                                payrollUser.final_rp_cache,
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <PrintHandler
                                                slotProps={{
                                                    printButton: {
                                                        size: 'small',
                                                        children:
                                                            isFinished ? undefined : ( // default
                                                                <VisibilityIcon />
                                                            ),
                                                    },
                                                    tooltip: {
                                                        title: isFinished
                                                            ? 'Cetak Slip Gaji'
                                                            : 'Pratinjau',
                                                    },
                                                }}
                                                documentTitle={
                                                    (isFinished
                                                        ? 'Slip Gaji'
                                                        : 'Pratinjau') +
                                                    payrollUser.user_state
                                                        .name +
                                                    ' (#' +
                                                    payrollUser.user_state.id +
                                                    ') - ' +
                                                    dayjs().format(
                                                        'YYYYMMDDHHmmss',
                                                    )
                                                }
                                                onBeforePrint={() => {
                                                    history.pushState(
                                                        null,
                                                        '',
                                                        '/finances/payrolls/employees/detail/' +
                                                            payrollUser.uuid,
                                                    )
                                                }}
                                                onAfterPrint={() => {
                                                    history.back()
                                                }}>
                                                <PayrollSlip
                                                    payrollData={data}
                                                    data={payrollUser}
                                                    isPreview={!isFinished}
                                                />
                                            </PrintHandler>
                                            {!isFinished && (
                                                <IconButton
                                                    size="small"
                                                    title="Atur"
                                                    onClick={() =>
                                                        handleOpen(payrollUser)
                                                    }
                                                    icon={SettingsIcon}
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
                    title="Rincian"
                    open={isDialogOpen}
                    maxWidth="sm">
                    <Formik
                        initialValues={initialFormikValues}
                        initialStatus={initialFormikStatus}
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
                        }
                        onReset={handleClose}>
                        {({ setErrors, ...props }) => (
                            <PayrollEmployeeDetailsForm
                                {...props}
                                setErrors={setErrors}
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
                            />
                        )}
                    </Formik>
                </DialogWithTitle>
            )}
        </>
    )
}
