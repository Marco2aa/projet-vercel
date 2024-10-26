/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { BASE_URL } from '../../config/api';
import axios from 'axios';
import { useState, useEffect } from 'react';


function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu() {
    return (
        <IconButton variant="plain" color="neutral" size="sm">
            <MoreHorizRoundedIcon />
        </IconButton>
    );
}

export default function OrderTable() {
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Récupérer les données depuis l'API
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${BASE_URL}/api/getorders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/ld+json',
                },
            });
            const orders = response.data;
            if (Array.isArray(orders)) {
                setRows(orders);
            } else {
                console.warn("La réponse ne contient pas de tableau d'ordres :", orders);
                setRows([]);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des données d'ordre:", err);
            setError('Erreur lors de la récupération des données');
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    return (
        <React.Fragment>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: 'none', sm: 'initial' },
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                                <Checkbox
                                    size="sm"
                                    indeterminate={selected.length > 0 && selected.length !== rows.length}
                                    checked={selected.length === rows.length}
                                    onChange={(event) => {
                                        setSelected(
                                            event.target.checked ? rows.map((row) => row.id) : [],
                                        );
                                    }}
                                    color={
                                        selected.length > 0 || selected.length === rows.length
                                            ? 'primary'
                                            : undefined
                                    }
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </th>
                            <th style={{ width: 120, padding: '12px 6px' }}>ID</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Date</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Type</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Montant</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Devise</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Reçu</th>
                            <th style={{ width: 140, padding: '12px 6px' }}> </th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...rows].sort(getComparator(order, 'id')).map((row) => (
                            <tr key={row.id}>
                                <td style={{ textAlign: 'center', width: 120 }}>
                                    <Checkbox
                                        size="sm"
                                        checked={selected.includes(row.id)}
                                        color={selected.includes(row.id) ? 'primary' : undefined}
                                        onChange={(event) => {
                                            setSelected((ids) =>
                                                event.target.checked
                                                    ? ids.concat(row.id)
                                                    : ids.filter((itemId) => itemId !== row.id),
                                            );
                                        }}
                                        sx={{ verticalAlign: 'text-bottom' }}
                                    />
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.id}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">
                                        {new Date(row.createdAt).toLocaleDateString()}
                                    </Typography>
                                </td>
                                <td>
                                    <Chip
                                        variant="soft"
                                        size="sm"
                                        color={
                                            {
                                                depot: 'warning',
                                                Achat: 'success',
                                                Vente: 'info',
                                                Retrait: 'danger',
                                            }[row.type] || 'neutral'
                                        }
                                        startDecorator={
                                            {
                                                depot: <AddCircleOutlineIcon />,
                                                achat: <ArrowUpwardIcon />,
                                                vente: <ArrowDownwardIcon />,
                                                retrait: <RemoveCircleOutlineIcon />,
                                            }[row.type] || null
                                        }
                                    >
                                        {row.type}
                                    </Chip>
                                </td>
                                <td>
                                    <Typography level="body-xs">{row.quantity}</Typography>
                                </td>
                                <td>
                                    <Typography level="body-xs">
                                        {row.devise ? `${row.devise.name} (${row.devise.valeur})` : 'N/A'}
                                    </Typography>
                                </td>
                                <td>
                                    {row.stripe && row.stripe.receipt_url ? (
                                        <Link
                                            level="body-xs"
                                            href={row.stripe.receipt_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Reçu Stripe
                                        </Link>
                                    ) : (
                                        <Typography level="body-xs" color="neutral">
                                            Non disponible
                                        </Typography>
                                    )}
                                </td>
                                <td>
                                    <RowMenu />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
        </React.Fragment>
    );
}