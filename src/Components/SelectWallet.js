import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



export default function SelectWallet({ wallets, onSelect }) {
    const [open, setOpen] = React.useState(false);
    const [selectedWallet, setSelectedWallet] = React.useState('');

    const handleChange = (event) => {
        const selectedId = event.target.value;
        const selectedWallet = wallets.find(wallet => wallet.id === selectedId);
        setSelectedWallet(selectedWallet ? selectedWallet.id : '');
        onSelect(selectedWallet ? selectedWallet.name : '');
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };

    return (
        <div style={{ margin: 'auto' }}>
            <Button color='warning' onClick={handleClickOpen}>Sélectionnez votre portefeuille</Button>
            <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
                <DialogTitle>Liste des portefeuilles</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-dialog-select-label">Portefeuille</InputLabel>
                            <Select
                                labelId="demo-dialog-select-label"
                                id="demo-dialog-select"
                                value={selectedWallet}
                                onChange={handleChange}
                                input={<OutlinedInput label="Portefeuille" />}
                            >
                                {wallets.map((wallet) => (
                                    <MenuItem key={wallet.id} value={wallet.id}>{wallet.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Annuler</Button>
                    <Button onClick={handleClose}>Valider</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

