import React, { FC } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'

import FormControl, { FormControlProps } from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectProps } from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'

const fetcher = (url: string) => axios.get(url).then(response => response.data)

const SWR_CONFIG = {
    revalidateOnFocus: false,
}

interface SelectFromApiProps extends FormControlProps {
    endpoint: string
    label?: string
    selectProps?: SelectProps
    helperText?: React.ReactNode
}

const SelectFromApi: FC<SelectFromApiProps> = ({
    endpoint,
    helperText,
    label,
    selectProps,
    ...props
}) => {
    const { data, isLoading } = useSWR(endpoint, fetcher, SWR_CONFIG)

    if (isLoading) return <Skeleton height="100%" />

    return (
        <FormControl fullWidth {...props}>
            {label && (
                <InputLabel shrink={selectProps?.displayEmpty}>
                    {label}
                </InputLabel>
            )}

            <Select {...(props as SelectProps)} {...selectProps} label={label}>
                {data?.map((item: any) => (
                    <MenuItem
                        key={item.uuid || item.id}
                        value={item.uuid || item.id}>
                        {item.name}
                    </MenuItem>
                ))}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    )
}

export default SelectFromApi
