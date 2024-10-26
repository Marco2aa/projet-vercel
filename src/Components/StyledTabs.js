import * as React from 'react';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import BuyCrypto from './BuyCrypto';
import { BorderBottom } from '@mui/icons-material';
import Withdrawal from './Withdrawal';
import Deposit from './Deposit';



const StyledTabs = styled((props) => (
    <Tabs
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
        maxWidth: 40,
        width: '100%',
        backgroundColor: 'orange',
    },
    borderBottom: 'solid 1px grey'
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: 'none',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-selected': {
            color: '#fff',
        },
        '&.Mui-focusVisible': {
            backgroundColor: 'rgba(100, 95, 228, 0.32)',
        },
        '&.MuiTabs-flexContainer': {
            backgroundColor: 'red'
        },


    }),
);

export default function CustomizedTabs() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '75%', marginTop: 3 }}>

            <Box sx={{ bgcolor: 'transparent', width: '100%' }}>
                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="styled tabs example"
                    sx={{ display: 'flex', width: '100%' }}
                >
                    <StyledTab label="Achat et vente" />
                    <StyledTab label="Dépôt" />
                    <StyledTab label="Retrait" />
                </StyledTabs>
                {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}> */}
                {value === 0 && <BuyCrypto />} {/* Afficher BuyCrypto lorsque l'onglet Achat et vente est sélectionné */}
                {value === 1 && <Deposit />} {/* Afficher DepositComponent lorsque l'onglet Dépôt est sélectionné */}
                {value === 2 && <Withdrawal />}
                {/* </div> */}

            </Box>
        </Box >
    );
}