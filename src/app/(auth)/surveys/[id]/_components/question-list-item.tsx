'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { Activity } from 'react'
import FlexBox from '@/components/flex-box'
import type QuestionORM from '../../_orms/question'

type Props = {
    question: QuestionORM
    sectionId: number
    onEdit: (question: QuestionORM) => void
    onDelete: (questionId: number) => Promise<void>
}

const QUESTION_TYPE_LABELS: Record<
    QuestionORM['type'],
    { label: string; color: string }
> = {
    multiselect: { color: '#00796b', label: 'Pilihan Ganda' },
    number: { color: '#0288d1', label: 'Angka' },
    radio: { color: '#388e3c', label: 'Pilihan Tunggal' },
    text: { color: '#1976d2', label: 'Teks' },
}

export default function QuestionListItem({
    question,
    onEdit,
    onDelete,
}: Props) {
    const typeConfig = QUESTION_TYPE_LABELS[question.type]

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id })

    const style = {
        opacity: isDragging ? 0.5 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const isRequired = question.rules?.includes('required')

    return (
        <ListItem
            ref={setNodeRef}
            secondaryAction={
                <Box display="flex" gap={1}>
                    <IconButton
                        edge="end"
                        onClick={() => onEdit(question)}
                        size="small">
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        color="error"
                        edge="end"
                        onClick={async () => {
                            if (
                                !confirm(
                                    `Hapus pertanyaan "${question.content}"?`,
                                )
                            )
                                return
                            await onDelete(question.id)
                        }}
                        size="small">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            }
            style={style}>
            <Box
                {...attributes}
                {...listeners}
                sx={{
                    alignItems: 'center',
                    cursor: 'grab',
                    display: 'flex',
                    mr: 1.5,
                }}>
                <DragIndicatorIcon fontSize="small" />
            </Box>

            <FlexBox
                alignItems="flex-start"
                flexDirection="column"
                gap={0}
                pr={10}>
                <FlexBox gap={1}>
                    {question.content}

                    <Activity mode={!isRequired ? 'visible' : 'hidden'}>
                        <Typography color="textDisabled" variant="body2">
                            Tidak wajib
                        </Typography>
                    </Activity>
                </FlexBox>

                <Box>
                    <Chip
                        label={typeConfig.label}
                        size="small"
                        sx={{
                            alignSelf: 'flex-start',
                            bgcolor: typeConfig.color,
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20,
                            mr: 1,
                        }}
                    />

                    {(question.type === 'radio' ||
                        question.type === 'multiselect') &&
                        Array.isArray(question.options) &&
                        question.options.length > 0 &&
                        question.options.map(opt => (
                            <Chip
                                key={opt}
                                label={opt}
                                size="small"
                                sx={{
                                    bgcolor: '#eee',
                                    color: '#333',
                                    fontSize: '0.7rem',
                                    height: 20,
                                }}
                            />
                        ))}
                </Box>
            </FlexBox>
        </ListItem>
    )
}
