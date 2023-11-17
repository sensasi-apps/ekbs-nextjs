export type OnRowClickType = (
    rowData: string[],
    rowMeta: {
        dataIndex: number
        rowIndex: number
    },
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
) => void
