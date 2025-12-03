'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useParams, useRouter } from 'next/navigation'
import { Activity, Fragment, useState } from 'react'
import useSWR from 'swr'
import DialogFormik from '@/components/dialog-formik'
import FlexBox from '@/components/flex-box'
import FlexColumnBox from '@/components/flex-column-box'
import UserSelect from '@/components/formik-fields/user-select'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
import type EntryORM from '../../_orms/entry'
import type QuestionORM from '../../_orms/question'
import type SectionORM from '../../_orms/section'
import type SurveyORM from '../../_orms/survey'

type SurveyWithEntries = Omit<SurveyORM, 'entries' | 'sections'> & {
    questions_count: number
    paginated_entries: LaravelPaginatedResponse<EntryORM>
    sections: (Omit<SectionORM, 'entries' | 'questions'> & {
        questions: QuestionORM[]
    })[]
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

    if (!surveyData) {
        if (isLoading) {
            return (
                <Box sx={{ p: 3 }}>
                    <LoadingCenter />
                </Box>
            )
        }

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
            <FlexBox alignItems="start" gap={2} mb={3}>
                <IconButton
                    onClick={() => push(`/surveys/${surveyIdFromParams}`)}
                    sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <PageTitle
                        subtitle={surveyData.name}
                        title="Entri Survey"
                    />
                </Box>
                <Button
                    onClick={() =>
                        push(`/surveys/${surveyIdFromParams}/summary`)
                    }
                    variant="outlined">
                    Lihat Rangkuman
                </Button>
            </FlexBox>

            <Activity mode={isLoading ? 'visible' : 'hidden'}>
                <LoadingCenter />
            </Activity>

            <FlexColumnBox>
                <FlexBox>
                    <Chip
                        color="primary"
                        label={`${surveyData.paginated_entries.total} Entri`}
                        variant="outlined"
                    />
                    <Chip
                        color="secondary"
                        label={`${surveyData.questions_count} Pertanyaan`}
                        variant="outlined"
                    />
                </FlexBox>

                <Pagination
                    count={Math.ceil(
                        surveyData.paginated_entries.total /
                            surveyData.paginated_entries.per_page,
                    )}
                    onChange={(_, page) => {
                        push(
                            `/surveys/${surveyIdFromParams}/entries?page=${page}`,
                        )
                    }}
                    page={surveyData.paginated_entries.current_page}
                />

                {surveyData.paginated_entries.data.map((entry, index) => (
                    <EntryCard
                        entry={entry}
                        entryNumber={index + 1}
                        key={entry.id}
                        onUserAssigned={() => mutate()}
                        sections={surveyData.sections}
                    />
                ))}
            </FlexColumnBox>
        </Box>
    )
}

function EntryCard({
    entry,
    entryNumber,
    onUserAssigned,
    sections,
}: {
    entry: EntryORM
    entryNumber: number
    // questions: Array<{
    //     id: number
    //     content: string
    //     type: string
    //     sectionName: string
    // }>
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

interface LaravelPaginatedResponse<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}
