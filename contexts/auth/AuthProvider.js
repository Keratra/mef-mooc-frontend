import { loadState, parseJwt, saveState } from 'lib';
import { ignoredRouteList } from 'utils/routes';
import initialState from './store';
import reducer from './reducer';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { LOGINUSER, LOGOUTUSER, SETUSERTYPE } from './types';
// import { notify } from '@components/Toast';
import Router from 'next/router';

const AuthContext = createContext();

function AuthProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const auth = loadState('token');
	const token = auth?.token;
	const tokenDetails = parseJwt(token);
	const isTokenExpired =
		tokenDetails?.exp && tokenDetails?.exp * 1000 < Date.now();

	useEffect(() => {
		if (tokenDetails?.sub?.type) {
			dispatch({
				type: SETUSERTYPE,
				payload: tokenDetails.sub.type,
			});
		}

		const userregexp = new RegExp(`\\b${tokenDetails?.sub?.type}\\b`, 'g');

		if (isTokenExpired && userregexp.test(Router.pathname)) {
			dispatch({ type: LOGOUTUSER });
			console.log('expired');
			// notify('error', 'Your session has expired. Please login again.');
			if (!ignoredRouteList.includes(Router.pathname)) {
				Router.push(`/${state?.token ? state.userType : ''}`);
			}
		}

		if (!isTokenExpired && !(token === null || token === undefined)) {
			dispatch({
				type: LOGINUSER,
				payload: {
					token,
					userType: tokenDetails?.sub?.type,
					userName: auth.userName,
				},
			});
		} else {
			dispatch({ type: LOGOUTUSER });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function loginWithToken({ token, userType, userName }) {
		saveState('token', { token, userName, userType });
		dispatch({
			type: LOGINUSER,
			payload: {
				token,
				userType,
				userName,
			},
		});
		// notify('success', 'Giriş yapıldı');
	}

	function logout() {
		saveState('token', {
			...loadState('token'),
			token: null,
			userName: null,
			isAuthenticated: false,
		});
		dispatch({
			type: SETUSERTYPE,
			payload: tokenDetails.sub.type,
		});
		dispatch({
			type: LOGOUTUSER,
		});
		// notify('success', 'Çıkış yapıldı');
	}

	return (
		<AuthContext.Provider
			value={{
				state,
				dispatch,
				logout,
				loginWithToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
