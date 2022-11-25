import { UserManager } from 'oidc-client-ts';
import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useSearchParams } from 'react-router-dom';

export const Callback: React.FC<{}> = () => {
    const [searchParams] = useSearchParams();
    const auth = useAuth();

    return (
        <div>
            <h1>Callback code {searchParams.get('code')}</h1>
        </div>
    );
};
