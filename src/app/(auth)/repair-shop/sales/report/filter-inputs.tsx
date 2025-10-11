'use client'

// materials
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
// hooks
import dayjs from 'dayjs'
import { useSearchParams } from 'next/navigation'
// vendors
import { useState } from 'react'
// components
import DatePicker from '@/components/DatePicker'
import FlexBox from '@/components/flex-box'
import useSetSearch from '@/hooks/use-set-search-params'

export const DEFAULT_FROM_DATE = dayjs().startOf('month').format('YYYY-MM-DD')
export const DEFAULT_TILL_DATE = dayjs().format('YYYY-MM-DD')

export default function FilterInputs() {
    const searchParams = useSearchParams()
    const setSearchParams = useSetSearch(searchParams)

    const [type, setType] = useState(
        (searchParams.get('type') ?? 'per-sale') as
            | 'per-sale'
            | 'per-payment-method'
            | 'per-spare-part',
    )
    const [fromDate, setFromDate] = useState(
        searchParams.get('from_date') ?? DEFAULT_FROM_DATE,
    )
    const [tillDate, setTillDate] = useState(
        searchParams.get('till_date') ?? DEFAULT_TILL_DATE,
    )

    function handleSubmit() {
        setSearchParams({
            from_date: fromDate,
            till_date: tillDate,
            type,
        })
    }

    return (
        <>
            <FlexBox mb={1}>
                <DatePicker
                    disableFuture
                    label="TGL. Awal"
                    minDate={dayjs(tillDate).subtract(3, 'month')}
                    name="from_date"
                    onChange={date =>
                        setFromDate(
                            date?.format('YYYY-MM-DD') ?? DEFAULT_FROM_DATE,
                        )
                    }
                    value={dayjs(fromDate)}
                />
                <DatePicker
                    disableFuture
                    label="TGL. Akhir"
                    maxDate={dayjs(fromDate).add(3, 'month')}
                    name="till_date"
                    onChange={date =>
                        setTillDate(
                            date?.format('YYYY-MM-DD') ?? DEFAULT_TILL_DATE,
                        )
                    }
                    value={dayjs(tillDate)}
                />
            </FlexBox>

            <input
                defaultValue={type}
                name="type"
                style={{
                    display: 'none',
                }}
                type="text"
            />

            <FlexBox justifyContent="space-between">
                <FlexBox>
                    <Chip
                        color={type === 'per-sale' ? 'success' : undefined}
                        label="Penjualan"
                        onClick={() => setType('per-sale')}
                    />
                    <Chip
                        color={
                            type === 'per-payment-method'
                                ? 'success'
                                : undefined
                        }
                        label="Metode Pembayaran"
                        onClick={() => setType('per-payment-method')}
                    />
                    <Chip
                        color={
                            type === 'per-spare-part' ? 'success' : undefined
                        }
                        label="Suku Cadang"
                        onClick={() => setType('per-spare-part')}
                    />
                </FlexBox>

                <Button
                    color="info"
                    onClick={handleSubmit}
                    size="small"
                    type="submit"
                    variant="contained">
                    Kirim
                </Button>
            </FlexBox>
        </>
    )
}
