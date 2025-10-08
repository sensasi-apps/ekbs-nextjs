import Button from '@mui/material/Button'
import Check from '@mui/icons-material/Check'

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
            onClick={() => onChange(!checked)}
            size="small"
            variant={checked ? 'outlined' : undefined}
            endIcon={checked ? <Check /> : undefined}>
            Tampilkan yang sudah dihapus
        </Button>
    )
}
