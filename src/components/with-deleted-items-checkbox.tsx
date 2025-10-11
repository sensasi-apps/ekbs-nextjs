import Check from '@mui/icons-material/Check'
import Button from '@mui/material/Button'

export default function WithDeletedItemsCheckbox({
    checked,
    onChange,
}: {
    checked: boolean
    onChange: (checked: boolean) => void
}) {
    return (
        <Button
            color="info"
            endIcon={checked ? <Check /> : undefined}
            onClick={() => onChange(!checked)}
            size="small"
            variant={checked ? 'outlined' : undefined}>
            Tampilkan yang sudah dihapus
        </Button>
    )
}
