import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const Callback: React.FC<{}> = () => {
    const [searchParams] = useSearchParams();

    return (
        <div>
            <h1>Callback code {searchParams.get('code')}</h1>
        </div>
    );
};
