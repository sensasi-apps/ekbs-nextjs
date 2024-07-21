// types
import type { ReactNode } from 'react'
import type { SelectProps } from '@mui/material/Select'
import type { FormControlProps } from '@mui/material/FormControl'
// vendors
import useSWR from 'swr'
// materials
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'

export default function SelectFromApi({
    endpoint,
    helperText,
    label,
    selectProps,
    onChange,
    onValueChange,
    renderOption,
    dataKey = 'uuid',
    ...rest
}: {
    endpoint: string
    label?: string
    selectProps?: Omit<SelectProps, 'onChange' | 'label'>
    helperText?: ReactNode
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderOption?: (option: any, index: number) => JSX.Element
    onChange?: SelectProps['onChange']
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onValueChange?: (value: any) => unknown
    dataKey?: string
} & Omit<FormControlProps, 'onChange'>) {
    // TODO: remove any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data = [], isLoading } = useSWR<any[]>(endpoint)

    return (
        <FormControl
            fullWidth
            {...rest}
            error={rest.error || data.length === 0}>
            {isLoading ? (
                <Skeleton height="2.5em" variant="rounded" />
            ) : (
                <>
                    {label && (
                        <InputLabel shrink={selectProps?.displayEmpty}>
                            {label}
                        </InputLabel>
                    )}
                    <Select
                        {...(rest as SelectProps)}
                        {...selectProps}
                        error={rest?.error || data.length === 0}
                        onChange={(ev, child) => {
                            const value = ev.target.value

                            onChange?.(ev, child)

                            onValueChange?.(
                                data.find(
                                    item =>
                                        (item[dataKey] ?? item.id) === value,
                                ),
                            )
                        }}
                        label={label}>
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
