import { FC } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'

import FormControl, { FormControlProps } from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select'
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
    onValueChange?: (value: any) => any
}

const SelectFromApi: FC<SelectFromApiProps> = ({
    endpoint,
    helperText,
    label,
    selectProps,
    onChange,
    onValueChange = () => {},
    ...props
}) => {
    const { data, isLoading } = useSWR(endpoint, fetcher, SWR_CONFIG)

    if (isLoading) return <Skeleton height="100%" />

    const handleChange = (event: SelectChangeEvent<unknown>) => {
        const value = event.target.value

        onChange?.(event as React.ChangeEvent<HTMLInputElement>)

        onValueChange(
            data.find((item: any) => (item.uuid || item.id) === value),
        )
    }

    return (
        <FormControl fullWidth {...props}>
            {label && (
                <InputLabel shrink={selectProps?.displayEmpty}>
                    {label}
                </InputLabel>
            )}

            <Select
                {...(props as SelectProps)}
                {...selectProps}
                onChange={handleChange}
                label={label}>
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
