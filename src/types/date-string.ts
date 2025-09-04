type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type Y = `19${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`
type m = `0${oneToNine}` | `1${0 | 1 | 2}`
type d = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`

// type h = `${0 | 1}${zeroToNine}` | `2${0 | 1 | 2 | 3}`
// type i = `${0 | 1 | 2 | 3 | 4 | 5}${zeroToNine}`
// type s = `${0 | 1 | 2 | 3 | 4 | 5}${zeroToNine}`

// export type dmY = `${d}-${m}-${Y}`
export type Ymd = `${Y}-${m}-${d}`
// type his = `${h}:${i}:${s}`
