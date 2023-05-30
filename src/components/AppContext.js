import React, { createContext, useEffect, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
	const [data, setData] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [themeColorMode, setThemeColorMode] = useState('dark');
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = () => {
		setIsDrawerOpen(prev => !prev);
	}

	useEffect(function () {
		const savedMode = localStorage.getItem('colorMode');

		if (savedMode !== 'dark') setThemeColorMode('light');
	}, []);

	const toggleColorMode = () => {
		setThemeColorMode((prevMode) => {
			const newMode = prevMode === 'light' ? 'dark' : 'light';

			localStorage.setItem('colorMode', newMode);

			return newMode;
		});
	};



	return (
		<AppContext.Provider value={{ data, setData, isLoading, setIsLoading, themeColorMode, toggleColorMode, isDrawerOpen, toggleDrawer }}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext, AppProvider };
