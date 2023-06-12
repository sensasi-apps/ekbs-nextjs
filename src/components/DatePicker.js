import { useEffect, useMemo, useState } from 'react';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';
import 'moment/locale/id';

import PropTypes from 'prop-types';
import moment from 'moment';

function DatePicker({ name, required, fullWidth, margin, error: extError, helperText, minDate, maxDate, ...props }) {
	const [error, setError] = useState(null);

	useEffect(() => {
		if (extError) {
			setError('Ekternal error');
		} else {
			setError(null);
		}

	}, [extError]);

	const errorMessage = useMemo(() => {
		switch (error) {
			case 'maxDate':
			case 'minDate': {
				console.log('error minDate or maxDate');
				return 'Your date is not valid'
			}

			case 'invalidDate': {
				return 'Your date is not valid';
			}

			default: {
				return helperText;
			}
		}
	}, [error]);

	return (
		<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="id">
			<DatePickerMui
				minDate={minDate || moment('1970-01-01')}
				maxDate={maxDate || moment('2038-01-19')}
				onError={(err) => setError(err)}
				slotProps={{
					textField: {
						error: Boolean(error),
						helperText: (errorMessage),
						required,
						fullWidth,
						margin,
						name
					}
				}}
				{...props}
			/>
		</LocalizationProvider>
	);
}

DatePicker.propTypes = {
	name: PropTypes.string,
	required: PropTypes.bool,
	fullWidth: PropTypes.bool
}

export default DatePicker;