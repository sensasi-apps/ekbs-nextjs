const sxs = {
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
    },
}

export default sxs
