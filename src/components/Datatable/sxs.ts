import type { SxProps } from '@mui/system/styleFunctionSx'

const sxs: {
    [key: string]: SxProps
} = {
    loadingTop: {
        borderTopLeftRadius: 11,
        borderTopRightRadius: 11,
        translate: '0 4px',
        zIndex: 1,
    },

    loadingBottom: {
        borderBottomLeftRadius: 11,
        borderBottomRightRadius: 11,
        translate: '0 -4px',
        zIndex: 1,
    },

    tableParent: {
        '& td, & th': {
            p: 1,
        },
        '& tbody .MuiTableRow-hover': {
            cursor: 'pointer',
        },
        translate: '0 -4px',
        userSelect: 'none',
        msUserSelect: 'none',
        webkitUserSelect: 'none',
        mozUserSelect: 'none',
    },
}

export default sxs
