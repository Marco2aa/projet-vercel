import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@mui/material';

const NavLink = ({ to, label, icon: Icon, variant = "text", color = "primary", ...props }) => {
    return (
        <Button
            component={RouterLink}
            to={to}
            variant={variant}
            color={color}
            startIcon={Icon ? <Icon /> : null}
            sx={{ color: "orange" }}
            {...props}
        >
            {label}
        </Button>
    );
};

export default NavLink;
