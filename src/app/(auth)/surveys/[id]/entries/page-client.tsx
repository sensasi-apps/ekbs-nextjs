'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import DialogFormik from '@/components/dialog-formik'
import FlexBox from '@/components/flex-box'
import FlexColumnBox from '@/components/flex-column-box'
import UserSelect from '@/components/formik-fields/user-select'
import LoadingCenter from '@/components/loading-center'
import type EntryORM from '../../_orms/entry'
import type SurveyORM from '../../_orms/survey'

type SurveyWithEntries = SurveyORM & {
    entries?: EntryORM[]
}

export default function EntriesPageClient({ surveyId }: { surveyId: number }) {
    const { push } = useRouter()
    const params = useParams()
    const surveyIdFromParams = params?.id as string

    const {
        data: surveyData,
        isLoading,
        mutate,
    } = useSWR<SurveyWithEntries>(`surveys/${surveyId}/entries`, {
        revalidateOnFocus: false,
    })

    const flattenedQuestions = useMemo(() => {
        if (!surveyData?.sections) return []

        return surveyData.sections.flatMap(section =>
            (section.questions || []).map(question => ({
                ...question,
                sectionName: section.name,
            })),
        )
    }, [surveyData])

    if (isLoading) {
        return <LoadingCenter />
    }

    if (!surveyData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">
                    Gagal memuat data entri survey
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ alignItems: 'center', display: 'flex', mb: 3 }}>
                <IconButton
                    onClick={() => push(`/surveys/${surveyIdFromParams}`)}
                    sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4">Entri Survey</Typography>
                    <Typography sx={{ mt: 1 }} variant="h6">
                        {surveyData.name}
                    </Typography>
                </Box>
                <Button
                    onClick={() =>
                        push(`/surveys/${surveyIdFromParams}/summary`)
                    }
                    variant="outlined">
                    Lihat Rangkuman
                </Button>
            </Box>

            {surveyData.entries && surveyData.entries.length > 0 ? (
                <FlexColumnBox>
                    <FlexBox>
                        <Chip
                            color="primary"
                            label={`${surveyData.entries.length} Entri`}
                            variant="outlined"
                        />
                        <Chip
                            color="secondary"
                            label={`${flattenedQuestions.length} Pertanyaan`}
                            variant="outlined"
                        />
                    </FlexBox>

                    {surveyData.entries.map((entry, index) => (
                        <EntryCard
                            entry={entry}
                            entryNumber={index + 1}
                            key={entry.id}
                            onUserAssigned={() => mutate()}
                            questions={flattenedQuestions}
                        />
                    ))}
                </FlexColumnBox>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body1">
                        Belum ada entri untuk survey ini.
                    </Typography>
                </Paper>
            )}
        </Box>
    )
}

function EntryCard({
    entry,
    entryNumber,
    questions,
    onUserAssigned,
}: {
    entry: EntryORM
    entryNumber: number
    questions: Array<{
        id: number
        content: string
        type: string
        sectionName: string
    }>
    onUserAssigned: () => void
}) {
    const formatAnswer = (questionId: number) => {
        const answer = entry.answers?.find(a => a.question_id === questionId)
        if (!answer) return '-'

        const question = questions.find(q => q.id === questionId)
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

                <TableContainer
                    component={Paper}
                    sx={{
                        mt: 3,
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
                                <TableCell>Bagian</TableCell>
                                <TableCell>Jawaban</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map(question => (
                                <TableRow key={question.id}>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {question.content}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={question.sectionName}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {formatAnswer(question.id)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
