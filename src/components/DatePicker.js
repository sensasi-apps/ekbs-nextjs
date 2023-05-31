import * as React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';
import 'moment/locale/id';

import PropTypes from 'prop-types';

function DatePicker({ name, required, fullWidth, margin, ...props }) {
	return (
		<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="id">
			<DatePickerMui
				{...props}
				slotProps={{
					textField: {
						required,
						fullWidth,
						margin,
						name
					}
				}}
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