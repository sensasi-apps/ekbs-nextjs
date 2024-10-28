import type User from '@/dataTypes/User'
import type { FieldProps } from 'formik'
import type { FormikStatusType } from '../../../../..'
import {
    Children,
    cloneElement,
    ComponentType,
    forwardRef,
    HTMLAttributes,
    isValidElement,
    memo,
    ReactElement,
    ReactNode,
    useState,
} from 'react'
import { Autocomplete, Box, Fade, IconButton } from '@mui/material'
import useSWR from 'swr'
import TextField from '@/components/TextField'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CloseIcon from '@mui/icons-material/Close'
import { List, ListRowProps } from 'react-virtualized'
import ApiUrl from '../../../../../../@enums/api-url'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

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
                size="small"
                color={show ? undefined : 'success'}
                disableRipple
                disabled={isSubmitting || typedStatus?.isDisabled}
                sx={{
                    p: 0,
                }}
                onClick={() => {
                    setFieldValue('buyer_user_uuid', undefined)
                    setFieldValue('buyer_user', undefined)
                    setShow(prev => !prev)
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
                        setFieldValue={setFieldValue}
                        required={show}
                        value={value}
                        error={errors.buyer_user_uuid as string}
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
        ApiUrl.USERS,
        null,
        {
            keepPreviousData: true,
        },
    )

    return (
        <Autocomplete
            disableListWrap
            getOptionLabel={({ name, id }) => `#${id} • ${name}`}
            onChange={(_, value) => {
                setFieldValue('buyer_user_uuid', value?.uuid)
                setFieldValue('buyer_user', value)
            }}
            disabled={disabled}
            value={value ?? null}
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
            ListboxComponent={
                ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>
            }
            options={users}
            renderInput={params => (
                <TextField
                    {...params}
                    required={required}
                    variant="outlined"
                    label="Cari pelanggan"
                    size="small"
                    margin="none"
                    fullWidth
                    {...errorsToHelperTextObj(error)}
                />
            )}
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
                        width={350}
                        rowHeight={itemSize}
                        overscanCount={5}
                        rowCount={itemCount}
                        rowRenderer={(listRowProps: ListRowProps) => {
                            if (isValidElement(items[listRowProps.index])) {
                                return cloneElement(items[listRowProps.index], {
                                    style: listRowProps.style,
                                })
                            }
                            return null
                        }}
                        role={role}
                    />
                </div>
            </div>
        )
    },
)
