'use client'

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import type QuestionORM from '../../_orms/question'
import QuestionListItem from './question-list-item'

type Props = {
    questions: QuestionORM[]
    sectionId: number
    onEdit: (question: QuestionORM) => void
    onDelete: (questionId: number) => Promise<void>
    onReorder: (sectionId: number, questions: QuestionORM[]) => Promise<void>
}

export default function QuestionList({
    questions,
    sectionId,
    onEdit,
    onDelete,
    onReorder,
}: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    )

    const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) return

        const oldIndex = sortedQuestions.findIndex(q => q.id === active.id)
        const newIndex = sortedQuestions.findIndex(q => q.id === over.id)

        if (oldIndex === -1 || newIndex === -1) return

        const reordered = [...sortedQuestions]
        const [moved] = reordered.splice(oldIndex, 1)
        reordered.splice(newIndex, 0, moved)

        await onReorder(sectionId, reordered)
    }

    if (questions.length === 0) {
        return (
            <Typography color="text.secondary" variant="body2">
                Belum ada pertanyaan. Klik tombol "Tambah Pertanyaan" untuk
                menambahkan.
            </Typography>
        )
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}>
            <SortableContext
                items={sortedQuestions.map(q => q.id)}
                strategy={verticalListSortingStrategy}>
                <List dense>
                    {sortedQuestions.map(question => (
                        <QuestionListItem
                            key={question.id}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            question={question}
                            sectionId={sectionId}
                        />
                    ))}
                </List>
            </SortableContext>
        </DndContext>
    )
}
