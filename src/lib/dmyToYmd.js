import PropTypes from 'prop-types'

function dmyToYmd(dmy) {
    const [d, m, y] = dmy.split('-')
    return `${y}-${m}-${d}`
}

dmyToYmd.PropTypes = {
    dmy: PropTypes.string.isRequired,
}

export default dmyToYmd
