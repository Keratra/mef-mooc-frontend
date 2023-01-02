import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useAuth } from 'contexts/auth/AuthProvider';
import { loadState, parseJwt } from 'lib';
import { ignoredRouteList } from 'utils/routes';
import Loader from './Loader';
// import { notify } from './Toast';

export default function RouteGuard({ children }) {
	const router = useRouter();

	const { state } = useAuth();

	const auth = loadState('token');
	const { isAuthenticated } = state;

	const token = auth?.token;
	const tokenDetails = parseJwt(token);
	const isTokenExpired =
		tokenDetails?.exp && tokenDetails?.exp * 1000 < Date.now();

	const isIgnored = ignoredRouteList.includes(router.pathname);

	useEffect(() => {
		if (!isIgnored && !token && !isAuthenticated) {
			router.push('/');
			// alert('not ignored, no token, not authenticated');
			// router.push(`/${tokenDetails?.sub.type || state.userType}`);
		} else if (!isIgnored && isTokenExpired) {
			router.push('/');
			// alert('not ignored, token expired');
			// router.push(`/${tokenDetails?.sub.type || state.userType}`);
			// notify('error', 'Your session has expired. Please login again');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, token]); // used to be [isAuthenticated, token]

	if (!isIgnored && !isAuthenticated) {
		return <Loader />;
		// return children;
	}

	return children;
}
