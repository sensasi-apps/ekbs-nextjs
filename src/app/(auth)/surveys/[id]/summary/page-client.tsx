'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DownloadIcon from '@mui/icons-material/Download'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import * as XLSX from 'xlsx'
import FlexBox from '@/components/flex-box'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
import ScrollableXBox from '@/components/scrollable-x-box'
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

    const handleDownloadExcel = () => {
        if (!surveyData) return

        const workbook = XLSX.utils.book_new()

        // Overview Sheet
        const overviewData = [
            ['RANGKUMAN SURVEY'],
            [],
            ['Nama Survey', surveyData.name],
            ['Deskripsi', surveyData.description || '-'],
            ['Total Pertanyaan', surveyData.questions_count],
            ['Total Responden', surveyData.entries_count],
            ['Tanggal Export', new Date().toLocaleString('id-ID')],
        ]
        const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData)
        XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview')

        // Section Sheets
        surveyData.sections?.forEach((section, sectionIdx) => {
            const sectionData: (string | number)[][] = [
                [`SECTION: ${section.name}`],
                [],
            ]

            section.questions?.forEach((question, questionIdx) => {
                const answers = question.answers ?? []
                const questionTypeLabels = {
                    multiselect: 'Pilihan Ganda',
                    number: 'Angka',
                    radio: 'Pilihan Tunggal',
                    text: 'Teks',
                }

                sectionData.push([`Pertanyaan ${questionIdx + 1}`])
                sectionData.push(['Konten', question.content])
                sectionData.push(['Tipe', questionTypeLabels[question.type]])
                sectionData.push(['Total Jawaban', answers.length])
                sectionData.push([])

                if (answers.length === 0) {
                    sectionData.push(['Belum ada jawaban'])
                } else {
                    switch (question.type) {
                        case 'text':
                            sectionData.push(['No', 'Jawaban'])
                            answers.forEach((answer, idx) => {
                                sectionData.push([
                                    idx + 1,
                                    answer.value || '(Kosong)',
                                ])
                            })
                            break

                        case 'number':
                            const numbers = answers
                                .map(a => parseFloat(a.value))
                                .filter(n => !isNaN(n))
                            const avg =
                                numbers.length > 0
                                    ? (
                                          numbers.reduce((a, b) => a + b, 0) /
                                          numbers.length
                                      ).toFixed(2)
                                    : 'N/A'

                            sectionData.push(['Statistik'])
                            sectionData.push(['Rata-rata', avg])
                            sectionData.push([
                                'Minimum',
                                numbers.length > 0
                                    ? Math.min(...numbers)
                                    : 'N/A',
                            ])
                            sectionData.push([
                                'Maksimum',
                                numbers.length > 0
                                    ? Math.max(...numbers)
                                    : 'N/A',
                            ])
                            sectionData.push([])
                            sectionData.push(['No', 'Jawaban'])
                            answers.forEach((answer, idx) => {
                                sectionData.push([
                                    idx + 1,
                                    answer.value || '(Kosong)',
                                ])
                            })
                            break

                        case 'radio':
                        case 'multiselect':
                            const optionCounts: Record<string, number> = {}

                            answers.forEach(answer => {
                                if (question.type === 'multiselect') {
                                    const selectedOptions = answer.value
                                        .split(',')
                                        .map(s => s.trim())
                                    selectedOptions.forEach(opt => {
                                        optionCounts[opt] =
                                            (optionCounts[opt] ?? 0) + 1
                                    })
                                } else {
                                    optionCounts[answer.value] =
                                        (optionCounts[answer.value] ?? 0) + 1
                                }
                            })

                            const totalSelections =
                                question.type === 'multiselect'
                                    ? Object.values(optionCounts).reduce(
                                          (a, b) => a + b,
                                          0,
                                      )
                                    : answers.length

                            sectionData.push(['Opsi', 'Jumlah', 'Persentase'])
                            question.options?.forEach(option => {
                                const count = optionCounts[option] || 0
                                const percentage =
                                    totalSelections > 0
                                        ? (
                                              (count / totalSelections) *
                                              100
                                          ).toFixed(0) + '%'
                                        : '0%'
                                sectionData.push([option, count, percentage])
                            })
                            break
                    }
                }

                sectionData.push([])
                sectionData.push([])
            })

            const sectionSheet = XLSX.utils.aoa_to_sheet(sectionData)
            const sheetName = `${sectionIdx + 1}. ${section.name}`.substring(
                0,
                31,
            ) // Excel sheet name limit
            XLSX.utils.book_append_sheet(workbook, sectionSheet, sheetName)
        })

        // Generate filename with timestamp
        const timestamp = new Date()
            .toISOString()
            .replace(/[:.]/g, '-')
            .substring(0, 19)
        const filename = `Rangkuman_Survey_${surveyData.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.xlsx`

        XLSX.writeFile(workbook, filename)
    }

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

            <FlexBox justifyContent="space-between" mb={3}>
                <FlexBox>
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

                <Button
                    onClick={handleDownloadExcel}
                    startIcon={<DownloadIcon />}
                    variant="contained">
                    Download Excel
                </Button>
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

                    <ScrollableXBox>
                        {answers?.map(answer => (
                            <Chip
                                key={answer.id}
                                label={`${answer.value ?? '(Kosong)'}`}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </ScrollableXBox>
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
