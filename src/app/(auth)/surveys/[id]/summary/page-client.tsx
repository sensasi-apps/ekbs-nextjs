'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
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
import { useRouter } from 'next/navigation'
import { Activity } from 'react'
import useSWR from 'swr'
import FlexBox from '@/components/flex-box'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
import type QuestionORM from '../../_orms/question'
import type SectionORM from '../../_orms/section'
import type SurveyORM from '../../_orms/survey'

type SurveySummaryApiResponse = Omit<SurveyORM, 'sections'> & {
    sections: (Omit<SectionORM, 'questions'> & {
        questions: QuestionORM[]
    })[]
    entries_count: number
    questions_count: number
}

export default function SummaryPageClient({ surveyId }: { surveyId: number }) {
    const { back } = useRouter()
    const { data: surveyData, isLoading } = useSWR<SurveySummaryApiResponse>(
        `surveys/${surveyId}/summary`,
        {
            revalidateOnFocus: false,
        },
    )

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
                <Typography color="error">Gagal memuat data survey</Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Activity mode={isLoading ? 'visible' : 'hidden'}>
                <LoadingCenter />
            </Activity>

            <FlexBox alignItems="flex-start">
                <IconButton onClick={() => back()} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>

                <div>
                    <PageTitle
                        subtitle={surveyData.name}
                        title="Rangkuman Jawaban Survey"
                    />
                </div>
            </FlexBox>

            <FlexBox mb={3}>
                <Chip
                    color="secondary"
                    label={`${surveyData.questions_count} Pertanyaan`}
                    variant="outlined"
                />
                <Chip
                    color="primary"
                    label={`${surveyData.entries_count} Responden`}
                    variant="outlined"
                />
            </FlexBox>

            {surveyData.sections?.map(section => (
                <Card key={section.id} sx={{ mb: 3 }}>
                    <CardHeader title={section.name} />

                    {(section.questions?.length ?? 0) > 0 && (
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3,
                            }}>
                            {section.questions?.map(question => (
                                <Box key={question.id}>
                                    <Typography>{question.content}</Typography>

                                    <QuestionSummary question={question} />
                                </Box>
                            ))}
                        </CardContent>
                    )}
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

const SummaryText = ({ children }: { children: React.ReactNode }) => (
    <Typography color="textSecondary" gutterBottom variant="body2">
        {children}
    </Typography>
)

const QuestionSummary = ({ question }: { question: QuestionORM }) => {
    const questionTypeLabels = {
        multiselect: 'Pilihan Ganda',
        number: 'Angka',
        radio: 'Pilihan Tunggal',
        text: 'Teks',
    }

    const typeLabel = questionTypeLabels[question.type]

    const answers = question.answers ?? []

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
                    <SummaryText>
                        {answers.length} jawaban ({typeLabel}):
                    </SummaryText>

                    <FlexBox>
                        {answers?.map(answer => (
                            <Chip
                                key={answer.id}
                                label={`${answer.value ?? '(Kosong)'}`}
                                size="small"
                            />
                        ))}
                    </FlexBox>
                </Box>
            )

        case 'number':
            const numbers =
                answers?.map(a => parseFloat(a.value)).filter(n => !isNaN(n)) ??
                []
            const avg =
                numbers.length > 0
                    ? (
                          numbers.reduce((a, b) => a + b, 0) / numbers.length
                      ).toFixed(2)
                    : 'N/A'

            return (
                <Box>
                    <SummaryText>
                        {answers?.length} jawaban ({typeLabel}):
                    </SummaryText>

                    <FlexBox gap={2} mb={1}>
                        <Chip label={`Rata-rata: ${avg}`} size="small" />
                        <Chip
                            label={`Min: ${Math.min(...numbers)}`}
                            size="small"
                        />
                        <Chip
                            label={`Max: ${Math.max(...numbers)}`}
                            size="small"
                        />
                    </FlexBox>

                    <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Jawaban</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {answers?.map((answer, idx) => (
                                    <TableRow key={answer.id}>
                                        <TableCell>{idx + 1}</TableCell>
                                        <TableCell>
                                            {answer.value ?? '(Kosong)'}
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
                    const selectedOptions = answer.value
                        .split(',')
                        .map(s => s.trim())
                    selectedOptions.forEach(opt => {
                        optionCounts[opt] = (optionCounts[opt] ?? 0) + 1
                    })
                } else {
                    optionCounts[answer.value] =
                        (optionCounts[answer.value] ?? 0) + 1
                }
            })

            const totalSelections =
                question.type === 'multiselect'
                    ? Object.values(optionCounts).reduce((a, b) => a + b, 0)
                    : (answers?.length ?? 0)

            return (
                <Box>
                    <SummaryText>
                        {answers?.length} responden, {totalSelections} pilihan (
                        {typeLabel}):
                    </SummaryText>

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
                                              ).toFixed(0)
                                            : '0'

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
