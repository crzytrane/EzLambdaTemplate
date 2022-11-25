import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

const App = () => {
    // const navigate = useNavigate();

    const onSigninCallback = (_user: any): void => {
        console.log('sign in callback', _user, window.location.href);

        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        );
    };
    const [loading, setLoading] = useState(false);
    const [authInfo, setAuthInfo] = useState<{
        authority: string;
        clientId: string;
    } | null>(null);

    useEffect(() => {
        fetch('api/authinfo').then((r) =>
            r.json().then((data) => {
                setAuthInfo(data);
                setLoading(false);
            })
        );
    }, []);

    const oidcConfig = {
        authority: authInfo?.authority as string,
        client_id: authInfo?.clientId as string,
        redirect_uri: `${window.location.origin}`,
        response_type: 'code',
        silent_redirect_uri: `${window.location.origin}/auth/silent`,
        filterProtocolClaims: true,
        loadUserInfo: true,
        metadata: {
            authorization_endpoint: `${authInfo?.authority}/oauth2/authorize`,
            token_endpoint: `${authInfo?.authority}/oauth2/token`,
            userinfo_endpoint: `${authInfo?.authority}/oauth2/userInfo`,
            login_endpoint: `${authInfo?.authority}/oauth2/login`,
            logout_endpoint: `${authInfo?.authority}/oauth2/logout?logout_uri=${window.location.origin}`,
            // jwks_uri: `...`,
        },
        scope: 'email openid phone profile https://localhost:44407/read https://localhost:44407/write',

        onSigninCallback: onSigninCallback,
    };

    if (loading || !authInfo) return <>Loading</>;

    const queryClient = new QueryClient();

    return (
        <Layout>
            <AuthProvider {...oidcConfig}>
                <QueryClientProvider client={queryClient}>
                    <Routes>
                        {AppRoutes.map((route, index) => {
                            const { element, ...rest } = route;
                            return (
                                <Route
                                    key={index}
                                    {...rest}
                                    element={element}
                                />
                            );
                        })}
                    </Routes>
                </QueryClientProvider>
            </AuthProvider>
        </Layout>
    );
};

export default App;
