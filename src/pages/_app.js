import { AppContext, AppProvider } from "@/components/AppContext"
import { CssBaseline } from "@mui/material"

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Link from "next/link";
import { forwardRef, useContext, useMemo } from "react";

const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
	return <Link ref={ref} {...props} />;
});

const Theme = ({ children }) => {
	const { themeColorMode } = useContext(AppContext);

	const theme = useMemo(
		() =>
			createTheme({
				components: {
					MuiLink: {
						defaultProps: {
							component: LinkBehaviour
						}
					},
					MuiButtonBase: {
						defaultProps: {
							LinkComponent: LinkBehaviour
						}
					}
				},
				palette: {
					mode: themeColorMode,
				},
			}),
		[themeColorMode],
	);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

			{children}
		</ThemeProvider>
	)
}

const App = ({ Component, pageProps }) => {

	return (
		<AppProvider>
			<Theme>
				<Component {...pageProps} />
			</Theme>
		</AppProvider>
	)
}

export default App
