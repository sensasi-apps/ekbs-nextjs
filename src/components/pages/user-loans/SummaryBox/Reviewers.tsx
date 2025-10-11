import Typography from '@mui/material/Typography'
import type UserLoanResponseORM from '@/modules/installment/types/orms/user-loan-response'

export default function UserLoanSummaryBoxReviewers({
    responses,
}: {
    responses: UserLoanResponseORM[]
}) {
    return (
        <div>
            <Typography color="GrayText">Telah ditinjau oleh:</Typography>
            {responses.length === 0 && <i>Belum ada peninjauan</i>}
            <ul
                style={{
                    margin: 0,
                }}>
                {responses.map(response => (
                    <li key={response.by_user_uuid}>
                        {'by_user' in response && response.by_user
                            ? response.by_user.name
                            : ''}
                        :{' '}
                        <Typography
                            color={
                                response.is_approved
                                    ? 'success.main'
                                    : 'error.main'
                            }
                            component="span">
                            {response.is_approved ? 'Menyetujui' : 'Menolak'}
                        </Typography>
                    </li>
                ))}
            </ul>
        </div>
    )
}
