'use client'

import axios from '@/lib/axios'
import useSWR from 'swr'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'

export default function SelectInputFromApi({
    nullLabel,
    endpoint,
    name,
    label,
    onChange,
    selectProps,
    helperText,
    ...props
}) {
    const fetcher = async url => {
        return (await axios.get(url)).data
    }

    const { data, isLoading } = useSWR(endpoint, fetcher)

    if (isLoading) return <Skeleton height="100%" />
    return (
        <FormControl fullWidth {...props}>
            {label && (
                <InputLabel shrink={selectProps.displayEmpty}>
                    {label}
                </InputLabel>
            )}

            <Select
                name={name}
                onChange={e => {
                    if (onChange) {
                        onChange(e)
                    }
                }}
                label={label}
                {...selectProps}>
                {nullLabel && (
                    <MenuItem value="" disabled={!selectProps.displayEmpty}>
                        <em>{nullLabel}</em>
                    </MenuItem>
                )}

                {data?.map(item => (
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
