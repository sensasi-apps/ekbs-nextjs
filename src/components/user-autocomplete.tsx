// vendors
import { type HTMLAttributes, useState } from 'react'
import useSWR from 'swr'
// materials
import Autocomplete, {
    type AutocompleteProps,
} from '@mui/material/Autocomplete'
import Box, { type BoxProps } from '@mui/material/Box'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
// components
import FlexBox from '@/components/flex-box'
// modules
import type MinimalUser from '@/modules/user/types/minimal-user'

type UserAutocompleteProps<
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
> = Omit<
    AutocompleteProps<MinimalUser, Multiple, DisableClearable, false>,
    'renderInput' | 'options'
> & {
    label: string
    slotProps?: {
        textField?: TextFieldProps
    }
}

export default function UserAutocomplete<
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
>({
    disabled,
    label,
    slotProps,

    ...restProps
}: UserAutocompleteProps<Multiple, DisableClearable>) {
    const [searchValue, setSearchValue] = useState('')
    const { data: users = [], isLoading } = useSWR<MinimalUser[]>(
        'data/minimal-users',
        null,
        {
            dedupingInterval: 60 * 60 * 1000, // 1 hour
        },
    )

    return (
        <Autocomplete
            disabled={disabled || isLoading}
            disableListWrap
            filterOptions={filterOptions}
            /**
             * `getOptionLabel` is overridden by `renderOption`
             * but required to be present
             */
            getOptionLabel={({ id, name }) => `${id} — ${name}`}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            loading={isLoading}
            loadingText="Sedang memuat..."
            noOptionsText={
                isSearchTermPassedTheRequirements(searchValue)
                    ? 'Pengguna tidak ditemukan'
                    : 'Ketik minimal 3 karakter'
            }
            onChange={(event, value, reason, details) => {
                restProps.onChange?.(event, value, reason, details)

                setSearchValue('')
            }}
            options={users}
            renderInput={params => {
                return (
                    <TextField
                        {...params}
                        required
                        variant="outlined"
                        label={label}
                        size="small"
                        margin="dense"
                        fullWidth
                        component="div"
                        onChange={({ currentTarget: { value } }) => {
                            setSearchValue(value)
                        }}
                        {...slotProps?.textField}
                    />
                )
            }}
            renderOption={renderOption}
            // renderValue={(value, getItemProps) => {
            //     if (Array.isArray(value)) {
            //         return (
            //             <FlexBox flexWrap="wrap" gap={1.5} {...getItemProps()}>
            //                 {value.map(user => (
            //                     <RenderMinimalUser
            //                         key={user.id}
            //                         data={user}
            //                         gap={0.7}
            //                     />
            //                 ))}
            //             </FlexBox>
            //         )
            //     }

            //     return (
            //         <RenderMinimalUser
            //             data={value}
            //             gap={1}
            //             mx={1}
            //             {...getItemProps()}
            //         />
            //     )
            // }}
            {...restProps}
        />
    )
}

function isSearchTermPassedTheRequirements(value: string) {
    const minChar = value.startsWith('#') || value.startsWith('@') ? 2 : 3

    return value.length >= minChar
}

function filterOptions(
    options: MinimalUser[],
    {
        inputValue,
    }: {
        inputValue: string
    },
) {
    if (!isSearchTermPassedTheRequirements(inputValue)) {
        return []
    }

    return options.filter(option => {
        if (inputValue.startsWith('#')) {
            return `#${option.id}` === inputValue
        }

        if (inputValue.startsWith('@')) {
            return `@${option.id}` === inputValue
        }

        return (
            option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
            option.nickname?.toLowerCase().includes(inputValue.toLowerCase())
        )
    })
}

function renderOption(
    props: HTMLAttributes<HTMLLIElement>,
    option: MinimalUser,
) {
    return (
        <Box
            {...props}
            component="li"
            width="100%"
            key={option.id}
            sx={{
                height: 'unset !important',
            }}>
            <RenderMinimalUser data={option} gap={2} renderDetail />
        </Box>
    )
}

function RenderMinimalUser({
    data: { id, name, nickname, role_names_id },
    renderDetail = false,
    ...props
}: {
    data: MinimalUser
    renderDetail?: boolean
} & BoxProps) {
    return (
        <FlexBox {...props}>
            <Chip
                size="small"
                color="info"
                label={id}
                variant="outlined"
                sx={{
                    fontSize: '0.7rem',
                }}
            />

            <div>
                <Box component="div" textTransform="capitalize">
                    {name}
                </Box>

                {renderDetail && (
                    <Typography
                        variant="caption"
                        component="div"
                        color="textDisabled"
                        textTransform="lowercase"
                        fontSize="0.75rem"
                        lineHeight="1em">
                        {nickname && (
                            <>
                                {nickname}
                                &nbsp;&nbsp;
                            </>
                        )}
                        {role_names_id.length > 0 && (
                            <>
                                —&nbsp;&nbsp;
                                {role_names_id.join(', ')}
                            </>
                        )}
                    </Typography>
                )}
            </div>
        </FlexBox>
    )
}
