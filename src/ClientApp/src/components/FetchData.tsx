import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';

type Forecast = {
    date: string;
    temperatureC: string;
    temperatureF: string;
    summary: string;
};

export const FetchData = () => {
    const [forecasts, setForecasts] = useState<Forecast[]>([]);

    const auth = useAuth();

    const { data, isLoading, isError, error, refetch } = useQuery<Forecast[]>(
        ['GetWeatherForecast'],
        () =>
            fetch(`api/weatherforecast`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${auth.user?.access_token}`,
                },
            }).then((x) => x.json()),
        { enabled: !!auth.isAuthenticated }
    );

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    if (!auth.isAuthenticated) {
        return (
            <button onClick={() => void auth.signinRedirect()}>Log in</button>
        );
    }

    if (!data) {
        return <div>Could'nt find any weather data</div>;
    }

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
                    {data.map((forecast) => (
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

    let contents = isLoading ? (
        <p>
            <em>Loading...</em>
        </p>
    ) : (
        renderForecastsTable()
    );

    return (
        <>
            <div>
                <h1 id="tabelLabel">Weather forecast</h1>
                <p>
                    This component demonstrates fetching data from the server.
                </p>
                {contents}
            </div>
            <div>
                Hello {auth.user?.profile.sub}{' '}
                <button onClick={() => void auth.removeUser()}>Log out</button>
            </div>
        </>
    );
};
