'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { useMemo } from 'react'
import useSWR from 'swr'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
import type EntryORM from '../../_orms/entry'
import type QuestionORM from '../../_orms/question'
import type SurveyORM from '../../_orms/survey'

type Props = {
    surveyId: number
}

type SurveyWithEntries = SurveyORM & {
    entries?: EntryORM[]
}

export default function SummaryPageClient({ surveyId }: Props) {
    const { data: surveyData, isLoading } = useSWR<SurveyWithEntries>(
        `surveys/${surveyId}/summary`,
        {
            revalidateOnFocus: false,
        },
    )

    const summaryStats = useMemo(() => {
        if (!surveyData?.entries) return null

        const totalEntries = surveyData.entries.length
        const totalQuestions =
            surveyData.sections?.reduce(
                (acc, section) => acc + (section.questions?.length || 0),
                0,
            ) || 0

        return { totalEntries, totalQuestions }
    }, [surveyData])

    if (isLoading) {
        return <LoadingCenter />
    }

    if (!surveyData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Gagal memuat data survey</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <PageTitle
                subtitle={surveyData.name}
                title="Rangkuman Jawaban Survey"
            />

            {summaryStats && (
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Chip
                        color="primary"
                        label={`${summaryStats.totalEntries} Responden`}
                        variant="outlined"
                    />
                    <Chip
                        color="secondary"
                        label={`${summaryStats.totalQuestions} Pertanyaan`}
                        variant="outlined"
                    />
                </Box>
            )}

            {surveyData.sections?.map(section => (
                <Card key={section.id} sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography sx={{ mb: 2 }} variant="h6">
                            {section.name}
                        </Typography>

                        {section.questions?.map(question => {
                            const answers =
                                surveyData.entries
                                    ?.flatMap(entry => entry.answers || [])
                                    .filter(
                                        answer =>
                                            answer.question_id === question.id,
                                    ) || []

                            return (
                                <Box key={question.id} sx={{ mb: 3 }}>
                                    <Typography
                                        sx={{ mb: 1 }}
                                        variant="subtitle1">
                                        {question.content}
                                    </Typography>

                                    <QuestionSummary
                                        answers={answers}
                                        question={question}
                                    />

                                    <Divider sx={{ mt: 2 }} />
                                </Box>
                            )
                        })}
                    </CardContent>
                </Card>
            ))}

            {(!surveyData.sections || surveyData.sections.length === 0) && (
                <Typography color="text.secondary">
                    Belum ada section atau pertanyaan dalam survey ini.
                </Typography>
            )}
        </Box>
    )
}

type QuestionSummaryProps = {
    question: QuestionORM
    answers: EntryORM['answers']
}

function QuestionSummary({ question, answers }: QuestionSummaryProps) {
    const questionTypeLabels = {
        multiselect: 'Pilihan Ganda',
        number: 'Angka',
        radio: 'Pilihan Tunggal',
        text: 'Teks',
    }

    const typeLabel = questionTypeLabels[question.type]

    if (answers?.length === 0) {
        return (
            <Typography color="text.secondary" variant="body2">
                Belum ada jawaban ({typeLabel})
            </Typography>
        )
    }

    switch (question.type) {
        case 'text':
            return (
                <Box>
                    <Typography sx={{ mb: 1 }} variant="body2">
                        {answers?.length} jawaban ({typeLabel}):
                    </Typography>
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                        {answers?.map((answer, idx) => (
                            <Paper
                                key={answer.id}
                                sx={{ bgcolor: '#f5f5f5', mb: 1, p: 1 }}>
                                <Typography variant="body2">
                                    {idx + 1}. {answer.text || '(Kosong)'}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            )

        case 'number':
            const numbers =
                answers?.map(a => parseFloat(a.text)).filter(n => !isNaN(n)) ??
                []
            const avg =
                numbers.length > 0
                    ? (
                          numbers.reduce((a, b) => a + b, 0) / numbers.length
                      ).toFixed(2)
                    : 'N/A'

            return (
                <Box>
                    <Typography sx={{ mb: 1 }} variant="body2">
                        {answers?.length} jawaban ({typeLabel}):
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                        <Chip label={`Rata-rata: ${avg}`} size="small" />
                        <Chip
                            label={`Min: ${Math.min(...numbers)}`}
                            size="small"
                        />
                        <Chip
                            label={`Max: ${Math.max(...numbers)}`}
                            size="small"
                        />
                    </Box>
                    <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Jawaban</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {answers?.map((answer, idx) => (
                                    <TableRow key={answer.id}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            {answer.text || '(Kosong)'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )

        case 'radio':
        case 'multiselect':
            const optionCounts: Record<string, number> = {}
            answers?.forEach(answer => {
                if (question.type === 'multiselect') {
                    // Untuk multiselect, jawaban bisa berupa array dipisah koma
                    const selectedOptions = answer.text
                        .split(',')
                        .map(s => s.trim())
                    selectedOptions.forEach(opt => {
                        optionCounts[opt] = (optionCounts[opt] || 0) + 1
                    })
                } else {
                    optionCounts[answer.text] =
                        (optionCounts[answer.text] || 0) + 1
                }
            })

            const totalSelections =
                question.type === 'multiselect'
                    ? Object.values(optionCounts).reduce((a, b) => a + b, 0)
                    : (answers?.length ?? 0)

            return (
                <Box>
                    <Typography sx={{ mb: 1 }} variant="body2">
                        {answers?.length} responden, {totalSelections} pilihan (
                        {typeLabel}):
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Opsi</TableCell>
                                    <TableCell align="right">Jumlah</TableCell>
                                    <TableCell align="right">
                                        Persentase
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {question.options?.map(option => {
                                    const count = optionCounts[option] || 0
                                    const percentage =
                                        totalSelections > 0
                                            ? (
                                                  (count / totalSelections) *
                                                  100
                                              ).toFixed(1)
                                            : '0.0'

                                    return (
                                        <TableRow key={option}>
                                            <TableCell>{option}</TableCell>
                                            <TableCell align="right">
                                                {count}
                                            </TableCell>
                                            <TableCell align="right">
                                                {percentage}%
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )

        default:
            return (
                <Typography color="text.secondary" variant="body2">
                    Tipe pertanyaan tidak dikenal
                </Typography>
            )
    }
}
