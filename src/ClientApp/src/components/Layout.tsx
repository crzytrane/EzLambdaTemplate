import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div>
            <NavMenu />
            <Container>{children}</Container>
        </div>
    );
};
