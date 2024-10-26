import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField } from '@mui/material';
import { Typography } from '@material-ui/core';

function FormLayout({ children }) {


    return (

        <Box
            height='100%'
            width='100%'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
            gap={4}
            marginTop={8} >
            {children}
        </Box >

    )
}

export default FormLayout;
