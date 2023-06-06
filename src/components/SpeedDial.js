import PropTypes from 'prop-types';

import { SpeedDial as SpeedDialMui } from '@mui/material';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

function SpeedDial({ icon, actions = [], color, ...props }) {
	return (
		<SpeedDialMui
			{...props}
			sx={{ position: 'fixed', bottom: 38, right: 38 }}
			icon={icon || <SpeedDialIcon />}
			FabProps={{
				color
			}}
		>
			{actions.map((action, i) => (
				<SpeedDialAction
					key={i}
					{...action}
				/>
			))}
		</SpeedDialMui>
	);
}

SpeedDial.propTypes = {
	...SpeedDialMui.propTypes,
	icon: PropTypes.node,
	actions: PropTypes.array,
	color: PropTypes.string
};

export default SpeedDial;