import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Fragment, useState } from 'react'
import DialogFormik from '@/components/dialog-formik'
import FlexBox from '@/components/flex-box'
import UserSelect from '@/components/formik-fields/user-select'
import type EntryORM from '../../_orms/entry'
import type SurveyORM from '../../_orms/survey'
export default function EntryCard({
    entry,
    entryNumber,
    onUserAssigned,
    sections,
}: {
    entry: EntryORM
    entryNumber: number
    onUserAssigned: () => void
    sections: SurveyORM['sections']
}) {
    const formatAnswer = (questionId: number) => {
        const answer = entry.answers?.find(a => a.question_id === questionId)
        if (!answer) return '-'

        const question = sections
            ?.flatMap(section => section.questions ?? [])
            .find(q => q.id === questionId)

        if (!question) return answer.value

        switch (question.type) {
            case 'multiselect':
                return answer.value.split(',').join(', ')
            case 'radio':
            case 'text':
            case 'number':
            default:
                return answer.value || '-'
        }
    }

    return (
        <Card>
            <CardContent>
                <FlexBox justifyContent="space-between">
                    <FlexBox gap={2}>
                        <Typography fontWeight="bold" variant="h6">
                            Entri #{entryNumber}
                        </Typography>

                        {entry.participant ? (
                            <Chip
                                color="primary"
                                label={entry.participant.name}
                                variant="outlined"
                            />
                        ) : (
                            <AssignUserDialogForm
                                entry_id={entry.id}
                                onUserAssigned={onUserAssigned}
                            />
                        )}
                    </FlexBox>

                    <Typography color="text.secondary" variant="body2">
                        {new Date(entry.created_at).toLocaleString('id-ID')}
                    </Typography>
                </FlexBox>

                {sections &&
                    sections.length > 0 &&
                    sections.map(section => (
                        <Fragment key={section.id}>
                            <Typography fontWeight="bold" mt={3}>
                                {section.name}
                            </Typography>

                            <TableContainer
                                component={Paper}
                                sx={{
                                    mt: 1,
                                }}
                                variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow
                                            sx={{
                                                '* > th': {
                                                    fontWeight: 'bold',
                                                },
                                            }}>
                                            <TableCell>Pertanyaan</TableCell>
                                            <TableCell>Jawaban</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {section.questions?.map(question => (
                                            <TableRow key={question.id}>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {question.content}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {formatAnswer(
                                                            question.id,
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Fragment>
                    ))}
            </CardContent>
        </Card>
    )
}

function AssignUserDialogForm({
    entry_id,
    onUserAssigned,
}: {
    entry_id: EntryORM['id']
    onUserAssigned: () => void
}) {
    const [formValues, setFormValues] = useState<{
        user_uuid: string | null
    } | null>(null)

    return (
        <>
            <Chip
                color="default"
                icon={<PersonAddIcon />}
                label="Atur Akun Pengguna"
                onClick={() => {
                    setFormValues({
                        user_uuid: null,
                    })
                }}
                variant="outlined"
            />

            <DialogFormik
                axiosConfig={{
                    method: 'PUT',
                    url: `/surveys/entries/${entry_id}/assign-user`,
                }}
                formFields={() => (
                    <UserSelect label="Pengguna" name="user_uuid" />
                )}
                initialValues={formValues}
                onReset={() => {
                    setFormValues(null)
                }}
                onSubmitted={() => {
                    onUserAssigned()
                    setFormValues(null)
                }}
                title="Atur Akun Pengguna"
            />
        </>
    )
}
