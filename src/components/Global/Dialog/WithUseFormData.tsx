import { FC, ReactNode } from 'react'
import useFormData from '@/providers/useFormData'
import Dialog, { DialogProps } from '.'

interface DialogWithUseFormDataProps
    extends Omit<DialogProps, 'open' | 'closeButtonProps'> {
    title: string
    children: ReactNode
}

const DialogWithUseFormData: FC<DialogWithUseFormDataProps> = ({
    title,
    children,
    ...rest
}) => {
    const { formOpen, handleClose, loading } = useFormData()

    const dialogProps = {
        title: title,
        open: formOpen,
        closeButtonProps: {
            onClick: handleClose,
            disabled: loading,
        },
    }

    return (
        <Dialog {...dialogProps} {...rest}>
            {children}
        </Dialog>
    )
}

export default DialogWithUseFormData
