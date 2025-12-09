'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Activity } from 'react'
import useSWR from 'swr'
import FlexBox from '@/components/flex-box'
import FlexColumnBox from '@/components/flex-column-box'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
import type EntryORM from '../../_orms/entry'
import type QuestionORM from '../../_orms/question'
import type SectionORM from '../../_orms/section'
import type SurveyORM from '../../_orms/survey'
import EntryCard from './entrry-card'

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
    const searchParams = useSearchParams()
    const page = searchParams.get('page')
    const {
        data: surveyData,
        isLoading,
        mutate,
    } = useSWR<SurveyWithEntries>(
        `surveys/${surveyId}/entries${page ? `?page=${page}` : ''}`,
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

                {surveyData.paginated_entries.data.map(entry => (
                    <EntryCard
                        entry={entry}
                        entryNumber={entry.id}
                        key={entry.id}
                        onUserAssigned={() => mutate()}
                        sections={surveyData.sections}
                    />
                ))}
            </FlexColumnBox>
        </Box>
    )
}

interface LaravelPaginatedResponse<T> {
    data: T[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}
