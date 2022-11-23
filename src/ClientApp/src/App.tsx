import React, { useEffect, useState } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

const App = () => {
    // const signInCallback = (user: any) => {
    //     router.push(PageUrls.Home);
    // };
    const [loading, setLoading] = useState(false);
    const [authInfo, setAuthInfo] = useState<{
        Authority: string;
        ClientId: string;
    } | null>(null);

    useEffect(() => {
        fetch('authinfo').then((r) =>
            r.json().then((data) => {
                setAuthInfo(data);
                setLoading(false);
            })
        );
    }, []);

    const oidcConfig = {
        authority: authInfo?.Authority as string,
        client_id: authInfo?.ClientId as string,
        redirect_uri: `${window.location.origin}/callback`,
        // onSigninCallback: signInCallback,
    };

    if (loading || !authInfo) return <>Loading</>;

    return (
        <Layout>
            <AuthProvider {...oidcConfig}>
                <Routes>
                    {AppRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return (
                            <Route key={index} {...rest} element={element} />
                        );
                    })}
                </Routes>
            </AuthProvider>
        </Layout>
    );
};

export default App;
