// types

import type { FormControlProps } from '@mui/material/FormControl'
// materials
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import type { SelectProps } from '@mui/material/Select'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import type { ReactNode } from 'react'
// vendors
import useSWR from 'swr'

export default function SelectFromApi({
    endpoint,
    helperText,
    label,
    selectProps,
    onChange,
    onValueChange,
    renderOption,
    margin,
    dataKey = 'uuid',
    ...rest
}: {
    endpoint: string
    label?: string
    selectProps?: Omit<SelectProps, 'onChange' | 'label' | 'margin'>
    helperText?: ReactNode
    // biome-ignore lint/suspicious/noExplicitAny: TODO: any will be remove
    renderOption?: (option: any, index: number) => ReactNode
    onChange?: SelectProps['onChange']
    // biome-ignore lint/suspicious/noExplicitAny: TODO: any will be remove
    onValueChange?: (value: any) => unknown
    dataKey?: string
} & Omit<FormControlProps, 'onChange'>) {
    // biome-ignore lint/suspicious/noExplicitAny: TODO: any will be remove
    const { data = [], isLoading } = useSWR<any[]>(endpoint)

    return (
        <FormControl
            fullWidth
            margin={margin}
            {...rest}
            error={rest.error || data.length === 0}>
            {isLoading ? (
                <Skeleton height="2.5em" variant="rounded" />
            ) : (
                <>
                    {label && (
                        <InputLabel
                            shrink={selectProps?.displayEmpty}
                            size={selectProps?.size}>
                            {label}
                        </InputLabel>
                    )}
                    <Select
                        {...(rest as SelectProps)}
                        {...selectProps}
                        error={rest?.error || data.length === 0}
                        label={label}
                        onChange={(ev, child) => {
                            const value = ev.target.value

                            onChange?.(ev, child)

                            onValueChange?.(
                                data.find(
                                    item =>
                                        (item[dataKey] ?? item.id) === value,
                                ),
                            )
                        }}>
                        {data.map(
                            renderOption ??
                                (item => (
                                    <MenuItem
                                        key={item[dataKey] ?? item.id}
                                        value={item[dataKey] ?? item.id}>
                                        {item.name}
                                    </MenuItem>
                                )),
                        )}
                    </Select>

                    {!isLoading && data.length === 0 && (
                        <FormHelperText>Tidak ada data</FormHelperText>
                    )}

                    {helperText && (
                        <FormHelperText>{helperText}</FormHelperText>
                    )}
                </>
            )}
        </FormControl>
    )
}
