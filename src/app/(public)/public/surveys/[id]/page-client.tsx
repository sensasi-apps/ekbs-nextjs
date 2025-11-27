'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import * as Yup from 'yup'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
import axios from '@/lib/axios'
import type SurveyORM from '../../../../(auth)/surveys/_orms/survey'

type FormValues = Record<string, string | number | string[]>

export default function FillSurveyPageClient({
    surveyId,
}: {
    surveyId: number
}) {
    const { push } = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { data: survey, isLoading } = useSWR<SurveyORM>(
        `surveys/${surveyId}`,
        {
            revalidateOnFocus: false,
        },
    )

    const generateValidationSchema = (survey: SurveyORM) => {
        const schema: Record<string, Yup.AnySchema> = {}

        survey.sections?.forEach(section => {
            section.questions?.forEach(question => {
                let fieldSchema: Yup.AnySchema

                switch (question.type) {
                    case 'text':
                        fieldSchema = Yup.string().required(
                            'Jawaban wajib diisi',
                        )
                        break
                    case 'number':
                        fieldSchema = Yup.number()
                            .required('Jawaban wajib diisi')
                            .typeError('Harus berupa angka')
                        break
                    case 'radio':
                        fieldSchema = Yup.string().required(
                            'Pilih salah satu opsi',
                        )
                        break
                    case 'multiselect':
                        fieldSchema = Yup.array()
                            .of(Yup.string())
                            .min(1, 'Pilih minimal satu opsi')
                            .required('Pilih minimal satu opsi')
                        break
                    default:
                        fieldSchema = Yup.mixed()
                }

                schema[`question_${question.id}`] = fieldSchema
            })
        })

        return Yup.object().shape(schema)
    }

    const generateInitialValues = (survey: SurveyORM): FormValues => {
        const values: FormValues = {}

        survey.sections?.forEach(section => {
            section.questions?.forEach(question => {
                if (question.type === 'multiselect') {
                    values[`question_${question.id}`] = []
                } else {
                    values[`question_${question.id}`] = ''
                }
            })
        })

        return values
    }

    const handleSubmit = async (values: FormValues) => {
        setIsSubmitting(true)

        try {
            const answers = Object.entries(values).map(([key, value]) => {
                const questionId = parseInt(key.replace('question_', ''))

                let text = ''
                if (Array.isArray(value)) {
                    text = value.join(',')
                } else {
                    text = String(value)
                }

                return {
                    question_id: questionId,
                    text,
                }
            })

            await axios.post(`surveys/${surveyId}/submit`, {
                answers,
            })

            // Redirect to thank you page
            push(`/public/surveys/${surveyId}/thank-you`)
        } catch (error) {
            alert('Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return <LoadingCenter />
    }

    if (!survey) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="error" variant="h6">
                        Survey tidak ditemukan
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                        Survey yang Anda cari mungkin sudah tidak tersedia atau
                        URL tidak valid.
                    </Typography>
                </Paper>
            </Container>
        )
    }

    const validationSchema = generateValidationSchema(survey)
    const initialValues = generateInitialValues(survey)

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <PageTitle title={survey.name} />

            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography color="text.secondary">
                        Silakan isi survey di bawah ini dengan jujur dan
                        lengkap. Semua pertanyaan wajib dijawab.
                    </Typography>
                </CardContent>
            </Card>

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}>
                {({ values, errors, touched, setFieldValue, handleChange }) => (
                    <Form>
                        {survey.sections?.map(section => (
                            <Card key={section.id} sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography sx={{ mb: 3 }} variant="h6">
                                        {section.name}
                                    </Typography>

                                    {section.questions?.map(question => (
                                        <Box key={question.id} sx={{ mb: 4 }}>
                                            <QuestionField
                                                error={
                                                    errors[
                                                        `question_${question.id}`
                                                    ]
                                                }
                                                onChange={handleChange}
                                                question={question}
                                                setFieldValue={setFieldValue}
                                                touched={
                                                    touched[
                                                        `question_${question.id}`
                                                    ]
                                                }
                                                value={
                                                    values[
                                                        `question_${question.id}`
                                                    ]
                                                }
                                            />
                                        </Box>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 4,
                            }}>
                            <Button
                                disabled={isSubmitting}
                                size="large"
                                sx={{ minWidth: 200 }}
                                type="submit"
                                variant="contained">
                                {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Container>
    )
}

type QuestionFieldProps = {
    question: {
        id: number
        content: string
        type: 'text' | 'number' | 'radio' | 'multiselect'
        options: string[] | null
    }
    value: string | number | string[]
    error?: string
    touched?: boolean
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void
    setFieldValue: (field: string, value: string | number | string[]) => void
}

function QuestionField({
    question,
    value,
    error,
    touched,
    onChange,
    setFieldValue,
}: QuestionFieldProps) {
    const fieldName = `question_${question.id}`

    switch (question.type) {
        case 'text':
            return (
                <TextField
                    error={touched && Boolean(error)}
                    fullWidth
                    helperText={touched && error}
                    label={question.content}
                    multiline
                    name={fieldName}
                    onChange={onChange}
                    required
                    rows={3}
                    value={value}
                />
            )

        case 'number':
            return (
                <TextField
                    error={touched && Boolean(error)}
                    fullWidth
                    helperText={touched && error}
                    label={question.content}
                    name={fieldName}
                    onChange={onChange}
                    required
                    type="number"
                    value={value}
                />
            )

        case 'radio':
            return (
                <FormControl error={touched && Boolean(error)} required>
                    <FormLabel>{question.content}</FormLabel>
                    <RadioGroup
                        name={fieldName}
                        onChange={onChange}
                        value={value}>
                        {question.options?.map((option: string) => (
                            <FormControlLabel
                                control={<Radio />}
                                key={option}
                                label={option}
                                value={option}
                            />
                        ))}
                    </RadioGroup>
                    {touched && error && (
                        <FormHelperText>{error}</FormHelperText>
                    )}
                </FormControl>
            )

        case 'multiselect':
            return (
                <FormControl error={touched && Boolean(error)} required>
                    <FormLabel>{question.content}</FormLabel>
                    <Box sx={{ mt: 1 }}>
                        {question.options?.map((option: string) => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            Array.isArray(value) &&
                                            value.includes(option)
                                        }
                                        onChange={e => {
                                            const currentValues = Array.isArray(
                                                value,
                                            )
                                                ? value
                                                : []
                                            if (e.target.checked) {
                                                setFieldValue(fieldName, [
                                                    ...currentValues,
                                                    option,
                                                ])
                                            } else {
                                                setFieldValue(
                                                    fieldName,
                                                    currentValues.filter(
                                                        (v: string) =>
                                                            v !== option,
                                                    ),
                                                )
                                            }
                                        }}
                                    />
                                }
                                key={option}
                                label={option}
                            />
                        ))}
                    </Box>
                    {touched && error && (
                        <FormHelperText>{error}</FormHelperText>
                    )}
                </FormControl>
            )

        default:
            return (
                <Typography color="error">
                    Tipe pertanyaan tidak dikenal: {question.type}
                </Typography>
            )
    }
}
