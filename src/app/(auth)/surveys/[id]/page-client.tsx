'use client'

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import LoadingCenter from '@/components/loading-center'
import axios from '@/lib/axios'
import handle422 from '@/utils/handle-422'
import type QuestionORM from '../_orms/question'
import type SectionORM from '../_orms/section'
import type SurveyORM from '../_orms/survey'
import QuestionFormDialog from './_components/question-form-dialog'
import SectionCard from './_components/section-card'

export default function PageClient() {
    const params = useParams()
    const { push } = useRouter()
    const surveyId = params?.id as string

    const { data: survey, mutate } = useSWR<SurveyORM>(
        surveyId ? `/surveys/${surveyId}` : null,
    )

    const [questionDialogOpen, setQuestionDialogOpen] = useState(false)
    const [activeSectionId, setActiveSectionId] = useState<number | null>(null)
    const [editingQuestion, setEditingQuestion] =
        useState<Partial<QuestionORM> | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id || !survey?.sections) return

        const oldIndex = survey.sections.findIndex(
            (s: SectionORM) => s.id === active.id,
        )
        const newIndex = survey.sections.findIndex(
            (s: SectionORM) => s.id === over.id,
        )

        const reordered = arrayMove(survey.sections, oldIndex, newIndex)

        // Optimistic update
        mutate(
            {
                ...survey,
                sections: reordered.map((s: SectionORM, idx: number) => ({
                    ...s,
                    order: idx,
                })),
            },
            false,
        )

        // Update backend
        try {
            await axios.put(`/surveys/${surveyId}/sections/reorder`, {
                sections: reordered.map((s: SectionORM, idx: number) => ({
                    id: s.id,
                    order: idx,
                })),
            })
            mutate()
        } catch (error: unknown) {
            handle422(error as AxiosError, () => {})
            mutate() // Revert on error
        }
    }

    const handleAddSection = async () => {
        try {
            await axios.post('/surveys/sections', {
                name: 'Section Baru',
                order:
                    (survey?.sections?.length || 0) > 0
                        ? Math.max(
                              ...(survey?.sections?.map(
                                  (s: SectionORM) => s.order,
                              ) || [0]),
                          ) + 1
                        : 0,
                survey_id: surveyId,
            })
            mutate()
        } catch (error) {
            handle422(error as AxiosError, () => {})
        }
    }

    const handleUpdateSectionName = async (sectionId: number, name: string) => {
        try {
            await axios.put(`/surveys/sections/${sectionId}`, { name })
            mutate()
        } catch (error) {
            handle422(error as AxiosError, () => {})
        }
    }

    const handleDeleteSection = async (sectionId: number) => {
        try {
            await axios.delete(`/surveys/sections/${sectionId}`)
            mutate()
        } catch (error) {
            handle422(error as AxiosError, () => {})
        }
    }

    const handleOpenQuestionDialog = (sectionId: number) => {
        setActiveSectionId(sectionId)
        setEditingQuestion(null)
        setQuestionDialogOpen(true)
    }

    const handleEditQuestion = (question: QuestionORM) => {
        setActiveSectionId(question.section_id!)
        setEditingQuestion(question)
        setQuestionDialogOpen(true)
    }

    const handleDeleteQuestion = async (questionId: number) => {
        try {
            await axios.delete(`/surveys/questions/${questionId}`)
            mutate()
        } catch (error: unknown) {
            handle422(error as AxiosError, () => {})
        }
    }

    const handleReorderQuestions = async (
        sectionId: number,
        questions: QuestionORM[],
    ) => {
        // Optimistic update
        if (survey?.sections) {
            const updatedSections = survey.sections.map((s: SectionORM) =>
                s.id === sectionId
                    ? {
                          ...s,
                          questions: questions.map((q, idx) => ({
                              ...q,
                              order: idx,
                          })),
                      }
                    : s,
            )
            mutate({ ...survey, sections: updatedSections }, false)
        }

        // Update backend
        try {
            await axios.put(
                `/surveys/sections/${sectionId}/questions/reorder`,
                {
                    questions: questions.map((q, idx) => ({
                        id: q.id,
                        order: idx,
                    })),
                },
            )
            mutate()
        } catch (error: unknown) {
            handle422(error as AxiosError, () => {})
            mutate() // Revert on error
        }
    }

    const handleSubmitQuestion = async (data: Partial<QuestionORM>) => {
        try {
            if (data.id) {
                await axios.put(`/surveys/questions/${data.id}`, data)
            } else {
                const section = survey?.sections?.find(
                    (s: SectionORM) => s.id === activeSectionId,
                )
                await axios.post('/surveys/questions', {
                    ...data,
                    order:
                        (section?.questions?.length || 0) > 0
                            ? Math.max(
                                  ...(section?.questions?.map(
                                      (q: QuestionORM) => q.order,
                                  ) || [0]),
                              ) + 1
                            : 0,
                    section_id: activeSectionId,
                    survey_id: surveyId,
                })
            }
            mutate()
        } catch (error: unknown) {
            handle422(error as AxiosError, () => {})
        }
    }

    if (!survey) {
        return <LoadingCenter />
    }

    return (
        <>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Box sx={{ alignItems: 'center', display: 'flex', mb: 3 }}>
                    <IconButton onClick={() => push('/surveys')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        sx={{ flexGrow: 1 }}
                        variant="h4">
                        {survey.name}
                    </Typography>
                    <Button
                        onClick={() => push(`/surveys/${surveyId}/summary`)}
                        variant="outlined">
                        Lihat Rangkuman
                    </Button>
                </Box>

                {!survey.sections || survey.sections.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary" variant="body1">
                            Belum ada bagian. Klik tombol "Tambah Bagian" untuk
                            memulai.
                        </Typography>
                    </Paper>
                ) : (
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}>
                        <SortableContext
                            items={survey.sections.map((s: SectionORM) => s.id)}
                            strategy={verticalListSortingStrategy}>
                            {survey.sections
                                .sort(
                                    (a: SectionORM, b: SectionORM) =>
                                        a.order - b.order,
                                )
                                .map((section: SectionORM) => (
                                    <SectionCard
                                        key={section.id}
                                        onAddQuestion={handleOpenQuestionDialog}
                                        onDelete={handleDeleteSection}
                                        onDeleteQuestion={handleDeleteQuestion}
                                        onEditQuestion={handleEditQuestion}
                                        onReorderQuestions={
                                            handleReorderQuestions
                                        }
                                        onUpdateName={handleUpdateSectionName}
                                        section={section}
                                    />
                                ))}
                        </SortableContext>
                    </DndContext>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        mt: 4,
                    }}>
                    <Button
                        onClick={handleAddSection}
                        startIcon={<AddIcon />}
                        variant="outlined">
                        Tambah Bagian
                    </Button>
                </Box>
            </Container>

            {questionDialogOpen && activeSectionId !== null && (
                <QuestionFormDialog
                    initialData={editingQuestion || undefined}
                    onClose={() => {
                        setQuestionDialogOpen(false)
                        setActiveSectionId(null)
                        setEditingQuestion(null)
                    }}
                    onSubmit={handleSubmitQuestion}
                    open={questionDialogOpen}
                    sectionId={activeSectionId}
                />
            )}
        </>
    )
}
