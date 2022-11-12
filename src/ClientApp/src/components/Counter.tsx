import React, { useState } from 'react';

export const Counter: React.FC<{}> = () => {
    const [counter, setCounter] = useState(0);

    return (
        <div>
            <h1>Counter Functional</h1>

            <p aria-live="polite">
                Current count: <strong>{counter}</strong>
            </p>

            <button
                className="btn btn-primary"
                onClick={() => setCounter(counter + 1)}
            >
                Increment
            </button>
        </div>
    );
};
