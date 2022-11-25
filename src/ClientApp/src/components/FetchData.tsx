import { useQuery } from '@tanstack/react-query';
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

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        const renderForecastsTable = () => {
            return (
                <table
                    className="table table-striped"
                    aria-labelledby="tabelLabel"
                >
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Temp. (C)</th>
                            <th>Temp. (F)</th>
                            <th>Summary</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data!.map((forecast) => (
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
            <>
                <div>
                    <h1 id="tabelLabel">Weather forecast</h1>
                    <p>
                        This component demonstrates fetching data from the
                        server.
                    </p>
                    {contents}
                </div>
                <div>
                    Hello {auth.user?.profile.sub}{' '}
                    <button onClick={() => void auth.removeUser()}>
                        Log out
                    </button>
                </div>
            </>
        );
    }

    return <button onClick={() => void auth.signinRedirect()}>Log in</button>;

    // useEffect(() => {
    //     if (!auth.isAuthenticated) {
    //         auth.signinRedirect();
    //     }
    // }, []);

    // const { data, isLoading, isError, error, refetch } = useQuery<Forecast[]>(
    //     ['GetWeatherForecast'],
    //     () =>
    //         fetch(`api/weatherforecast`, {
    //             method: 'GET',
    //             mode: 'cors',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 authorization: `Bearer ${auth.user?.access_token}`,
    //             },
    //         }).then((x) => x.json()),
    //     { enabled: !!auth.isAuthenticated }
    // );

    // useEffect(() => {
    //     console.log(data);
    // }, [isLoading]);

    // const renderForecastsTable = () => {
    //     return (
    //         <table className="table table-striped" aria-labelledby="tabelLabel">
    //             <thead>
    //                 <tr>
    //                     <th>Date</th>
    //                     <th>Temp. (C)</th>
    //                     <th>Temp. (F)</th>
    //                     <th>Summary</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {forecasts.map((forecast) => (
    //                     <tr key={forecast.date}>
    //                         <td>{forecast.date}</td>
    //                         <td>{forecast.temperatureC}</td>
    //                         <td>{forecast.temperatureF}</td>
    //                         <td>{forecast.summary}</td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     );
    // };

    // let contents = loading ? (
    //     <p>
    //         <em>Loading...</em>
    //     </p>
    // ) : (
    //     renderForecastsTable()
    // );

    // return (
    //     <div>
    //         <h1 id="tabelLabel">Weather forecast</h1>
    //         <p>This component demonstrates fetching data from the server.</p>
    //         {contents}
    //     </div>
    // );
};
