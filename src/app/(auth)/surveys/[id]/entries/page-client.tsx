'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
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
import { useMemo } from 'react'
import useSWR from 'swr'
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

    const { data: surveyData, isLoading } = useSWR<SurveyWithEntries>(
        `surveys/${surveyId}/entries`,
        {
            revalidateOnFocus: false,
        },
    )

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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ alignItems: 'center', display: 'flex', gap: 2 }}>
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
                    </Box>

                    {surveyData.entries.map((entry, index) => (
                        <EntryCard
                            entry={entry}
                            entryNumber={index + 1}
                            key={entry.id}
                            questions={flattenedQuestions}
                        />
                    ))}
                </Box>
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

type EntryCardProps = {
    entry: EntryORM
    entryNumber: number
    questions: Array<{
        id: number
        content: string
        type: string
        sectionName: string
    }>
}

function EntryCard({ entry, entryNumber, questions }: EntryCardProps) {
    const formatAnswer = (questionId: number) => {
        const answer = entry.answers?.find(a => a.question_id === questionId)
        if (!answer) return '-'

        const question = questions.find(q => q.id === questionId)
        if (!question) return answer.text

        switch (question.type) {
            case 'multiselect':
                return answer.text.split(',').join(', ')
            case 'radio':
            case 'text':
            case 'number':
            default:
                return answer.text || '-'
        }
    }

    return (
        <Card>
            <CardContent>
                <Box sx={{ alignItems: 'center', display: 'flex', mb: 2 }}>
                    <Typography sx={{ flexGrow: 1 }} variant="h6">
                        Entri #{entryNumber}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                        {new Date(entry.created_at).toLocaleString('id-ID')}
                    </Typography>
                </Box>

                {entry.participant && (
                    <Box sx={{ mb: 2 }}>
                        <Typography color="text.secondary" variant="body2">
                            Partisipan: {entry.participant.name}
                        </Typography>
                    </Box>
                )}

                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Pertanyaan
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Bagian
                                </TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>
                                    Jawaban
                                </TableCell>
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
