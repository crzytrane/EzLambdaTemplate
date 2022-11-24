import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';

type Forecast = {
    date: string;
    temperatureC: string;
    temperatureF: string;
    summary: string;
};

export const FetchData = () => {
    const [forecasts, setForecasts] = useState<Forecast[]>([]);
    const [loading, setLoading] = useState(true);

    const auth = useAuth();

    useEffect(() => {
        auth.signinRedirect({
            redirect_uri: 'https://localhost:44407/callback',
        });
    }, []);

    useEffect(() => {
        console.log('authenticated', auth.isAuthenticated);
    }, [auth.isAuthenticated]);

    useEffect(() => {
        fetch('api/weatherforecast').then((r) =>
            r.json().then((data) => {
                setForecasts(data);
                setLoading(false);
            })
        );
    }, []);

    const renderForecastsTable = () => {
        return (
            <table className="table table-striped" aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map((forecast) => (
                        <tr key={forecast.date}>
                            <td>{forecast.date}</td>
                            <td>{forecast.temperatureC}</td>
                            <td>{forecast.temperatureF}</td>
                            <td>{forecast.summary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    let contents = loading ? (
        <p>
            <em>Loading...</em>
        </p>
    ) : (
        renderForecastsTable()
    );

    return (
        <div>
            <h1 id="tabelLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );
};
