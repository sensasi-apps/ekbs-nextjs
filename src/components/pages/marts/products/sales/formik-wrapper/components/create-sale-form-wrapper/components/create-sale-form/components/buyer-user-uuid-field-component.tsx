'use client'

// icons-materials
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CloseIcon from '@mui/icons-material/Close'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import type { FieldProps } from 'formik'
// vendors
import {
    Children,
    type ComponentType,
    cloneElement,
    forwardRef,
    type HTMLAttributes,
    isValidElement,
    memo,
    type ReactElement,
    type ReactNode,
    useState,
} from 'react'
// icons
import { List, type ListRowProps } from 'react-virtualized'
import useSWR from 'swr'
import TextField from '@/components/TextField'
//
import type User from '@/modules/user/types/orms/user'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import type { FormikStatusType } from '../../../../..'

type UserSelectItemData = {
    id: User['id']
    uuid: User['uuid']
    name: User['name']
    nickname: User['nickname']
}

function BuyerUserUuidFieldComponent({
    field: { value },
    form: { setFieldValue, isSubmitting, status, errors },
}: FieldProps<UserSelectItemData>) {
    const typedStatus = status as FormikStatusType
    const [show, setShow] = useState(false)

    return (
        <>
            <IconButton
                color={show ? undefined : 'success'}
                disabled={isSubmitting || typedStatus?.isDisabled}
                disableRipple
                onClick={() => {
                    setFieldValue('buyer_user_uuid', undefined)
                    setFieldValue('buyer_user', undefined)
                    setShow(prev => !prev)
                }}
                size="small"
                sx={{
                    p: 0,
                }}>
                {show ? (
                    <CloseIcon fontSize="small" />
                ) : (
                    <AddCircleIcon fontSize="small" />
                )}
            </IconButton>

            <Fade in={show}>
                <Box width="100%">
                    <VirtualizedAutocomplete
                        disabled={isSubmitting || !!typedStatus?.isDisabled}
                        error={errors.buyer_user_uuid as string}
                        required={show}
                        setFieldValue={setFieldValue}
                        value={value}
                    />
                </Box>
            </Fade>
        </>
    )
}

export default memo(BuyerUserUuidFieldComponent)

function VirtualizedAutocomplete({
    disabled,
    setFieldValue,
    required,
    value,
    error,
}: {
    disabled: boolean
    setFieldValue: FieldProps<UserSelectItemData>['form']['setFieldValue']
    required: boolean
    value: UserSelectItemData
    error: string | undefined
}) {
    const { data: users = [] } = useSWR<UserSelectItemData[]>(
        'marts/products/sales/users',
        null,
        {
            keepPreviousData: true,
        },
    )

    return (
        <Autocomplete
            disabled={disabled}
            disableListWrap
            filterOptions={(options, { inputValue }) => {
                if (!inputValue || inputValue.length <= 3) {
                    return []
                }

                return options.filter(option =>
                    option.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()),
                )
            }}
            getOptionLabel={({ name, id }) => `#${id} • ${name}`}
            ListboxComponent={
                ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>
            }
            onChange={(_, value) => {
                setFieldValue('buyer_user_uuid', value?.uuid)
                setFieldValue('buyer_user', value)
            }}
            options={users}
            renderInput={params => (
                <TextField
                    {...params}
                    fullWidth
                    label="Cari pelanggan"
                    margin="none"
                    required={required}
                    size="small"
                    variant="outlined"
                    {...errorsToHelperTextObj(error)}
                />
            )}
            value={value ?? null}
        />
    )
}

type ListboxComponentProps = HTMLAttributes<HTMLElement> & {
    children: ReactNode
    role: string
}

const ListboxComponent = forwardRef<HTMLDivElement, ListboxComponentProps>(
    function ListboxComponent(props, ref) {
        const { children, role, ...other } = props
        const items = Children.toArray(children) as ReactElement[]
        const itemCount = items.length
        const itemSize = 40
        const listHeight = itemSize * itemCount

        return (
            <div ref={ref}>
                <div {...other}>
                    <List
                        height={Math.min(listHeight, 250)}
                        overscanCount={5}
                        role={role}
                        rowCount={itemCount}
                        rowHeight={itemSize}
                        rowRenderer={(listRowProps: ListRowProps) => {
                            if (isValidElement(items[listRowProps.index])) {
                                return cloneElement(items[listRowProps.index], {
                                    // @ts-expect-error  TODO: will fix see https://mui.com/material-ui/react-autocomplete/#virtualization
                                    style: listRowProps.style,
                                })
                            }
                            return null
                        }}
                        width={350}
                    />
                </div>
            </div>
        )
    },
)
