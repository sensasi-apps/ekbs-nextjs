'use client'

// vendors
import { useState } from 'react'
// materials
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
// components
import DatePicker from '@/components/DatePicker'
import FlexBox from '@/components/flex-box'
// hooks
import dayjs from 'dayjs'
import useSetSearch from '@/hooks/use-set-search-params'
import { useSearchParams } from 'next/navigation'

const DEFAULT_FROM_DATE = dayjs().startOf('month').format('YYYY-MM-DD')
const DEFAULT_TILL_DATE = dayjs().format('YYYY-MM-DD')

export default function FilterInputs() {
    const searchParams = useSearchParams()
    const setSearchParams = useSetSearch(searchParams)

    const [type, setType] = useState(searchParams.get('type') ?? 'per-sale')
    const [fromDate, setFromDate] = useState(
        searchParams.get('from_date') ?? DEFAULT_FROM_DATE,
    )
    const [tillDate, setTillDate] = useState(
        searchParams.get('till_date') ?? DEFAULT_TILL_DATE,
    )

    function handleSubmit() {
        setSearchParams({
            type,
            from_date: fromDate,
            till_date: tillDate,
        })
    }

    return (
        <>
            <FlexBox mb={1}>
                <DatePicker
                    label="TGL. Awal"
                    name="from_date"
                    minDate={dayjs(tillDate).subtract(3, 'month')}
                    value={dayjs(fromDate)}
                    onChange={date =>
                        setFromDate(
                            date?.format('YYYY-MM-DD') ?? DEFAULT_FROM_DATE,
                        )
                    }
                    disableFuture
                />
                <DatePicker
                    label="TGL. Akhir"
                    name="till_date"
                    value={dayjs(tillDate)}
                    maxDate={dayjs(fromDate).add(3, 'month')}
                    onChange={date =>
                        setTillDate(
                            date?.format('YYYY-MM-DD') ?? DEFAULT_TILL_DATE,
                        )
                    }
                    disableFuture
                />
            </FlexBox>

            <input
                type="text"
                name="type"
                defaultValue={type}
                style={{
                    display: 'none',
                }}
            />

            <FlexBox justifyContent="space-between">
                <FlexBox>
                    <Chip
                        label="Penjualan"
                        color={type === 'per-sale' ? 'success' : undefined}
                        onClick={() => setType('per-sale')}
                    />
                    <Chip
                        label="Metode Pembayaran"
                        color={
                            type === 'per-payment-method'
                                ? 'success'
                                : undefined
                        }
                        onClick={() => setType('per-payment-method')}
                    />
                </FlexBox>

                <Button
                    variant="contained"
                    size="small"
                    type="submit"
                    onClick={handleSubmit}>
                    Kirim
                </Button>
            </FlexBox>
        </>
    )
}
