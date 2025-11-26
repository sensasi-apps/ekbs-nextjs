'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import type QuestionORM from '../../_orms/question'
import type SectionORM from '../../_orms/section'
import QuestionList from './question-list'

type Props = {
    section: SectionORM
    onUpdateName: (sectionId: number, name: string) => Promise<void>
    onDelete: (sectionId: number) => Promise<void>
    onAddQuestion: (sectionId: number) => void
    onEditQuestion: (question: QuestionORM) => void
    onDeleteQuestion: (questionId: number) => Promise<void>
    onReorderQuestions: (
        sectionId: number,
        questions: QuestionORM[],
    ) => Promise<void>
}

export default function SectionCard({
    section,
    onUpdateName,
    onDelete,
    onAddQuestion,
    onEditQuestion,
    onDeleteQuestion,
    onReorderQuestions,
}: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(section.name)
    const [isLoading, setIsLoading] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id })

    const handleSaveName = async () => {
        if (name.trim() === section.name) {
            setIsEditing(false)
            return
        }

        setIsLoading(true)
        try {
            await onUpdateName(section.id, name.trim())
            setIsEditing(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (
            !confirm(
                `Hapus section "${section.name}"? Semua pertanyaan di dalamnya akan ikut terhapus.`,
            )
        )
            return

        setIsLoading(true)
        try {
            await onDelete(section.id)
        } finally {
            setIsLoading(false)
        }
    }

    const style = {
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Card ref={setNodeRef} style={style} sx={{ mb: 2 }}>
            <CardHeader
                action={
                    <IconButton
                        color="error"
                        disabled={isLoading}
                        onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                }
                avatar={
                    <Box
                        {...attributes}
                        {...listeners}
                        sx={{
                            alignItems: 'center',
                            cursor: 'grab',
                            display: 'flex',
                        }}>
                        <DragIndicatorIcon />
                    </Box>
                }
                title={
                    isEditing ? (
                        <TextField
                            autoFocus
                            disabled={isLoading}
                            fullWidth
                            onBlur={handleSaveName}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleSaveName()
                                } else if (e.key === 'Escape') {
                                    setName(section.name)
                                    setIsEditing(false)
                                }
                            }}
                            size="small"
                            value={name}
                            variant="standard"
                        />
                    ) : (
                        <Box
                            onClick={() => setIsEditing(true)}
                            sx={{ cursor: 'pointer' }}>
                            {section.name}
                        </Box>
                    )
                }
            />
            <CardContent>
                <QuestionList
                    onDelete={onDeleteQuestion}
                    onEdit={onEditQuestion}
                    onReorder={onReorderQuestions}
                    questions={section.questions || []}
                    sectionId={section.id}
                />

                <Button
                    onClick={() => onAddQuestion(section.id)}
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    variant="outlined">
                    Tambah Pertanyaan
                </Button>
            </CardContent>
        </Card>
    )
}
