import React, { useEffect, useState } from 'react';
import { AuthProvider } from 'react-oidc-context';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';

const App = () => {
    const navigate = useNavigate();
    const signInCallback = (user: any) => {
        navigate('/');
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
        redirect_uri: `${window.location.origin}/callback`,
        onSigninCallback: signInCallback,
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
