import PropTypes from 'prop-types'

import axios from '@/lib/axios'
import useSWR from 'swr'

import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'

const fetcher = url => {
    return axios.get(url).then(response => response.data)
}

const SWR_CONFIG = {
    revalidateOnFocus: false,
}

const SelectInputFromApi = ({
    nullLabel,
    endpoint,
    name,
    label,
    onChange,
    selectProps,
    helperText,
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
                    <MenuItem value="" disabled={!selectProps?.displayEmpty}>
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

SelectInputFromApi.propTypes = {
    nullLabel: PropTypes.string,
    endpoint: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    selectProps: PropTypes.object,
    helperText: PropTypes.string,
}

export default SelectInputFromApi
