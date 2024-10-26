import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { LinearProgress, Typography } from '@mui/material';
import { BASE_URL } from '../config/api';

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 70
    },
    {
        field: 'type',
        headerName: 'Type',
        width: 250
    },
    {
        field: 'quantity',
        headerName: 'Montant',
        width: 130,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.quantity}
                </div>
            );
        },
    },
    {
        field: 'createdAt',
        headerName: 'Executé le :',
        width: 200,
        renderCell: (params) => {
            const order = params.row;
            const formattedDate = new Date(order.createdAt).toLocaleString();
            return <div>{formattedDate}</div>;
        },
    },
    {
        field: 'wallet',
        headerName: 'Wallet',
        width: 150,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.wallet ? order.wallet.name : ''}
                </div>
            );
        },
    },
    {
        field: 'devise',
        headerName: 'Devise',
        width: 150,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.devise ? order.devise.name : ''}
                </div>
            );
        },
    },
    {
        field: 'deviseValue',
        headerName: 'Valeur de la Devise',
        width: 150,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.deviseValue ? order.deviseValue.toFixed(5) : ''} {/* Valeur formatée à 5 décimales */}
                </div>
            );
        },
    },
    {
        field: 'cryptoPriceAtTransaction',
        headerName: 'Prix Crypto',
        width: 150,
        renderCell: (params) => {
            const order = params.row;
            return (
                <div>
                    {order.cryptoPriceAtTransaction ? order.cryptoPriceAtTransaction.toFixed(5) : ''} {/* Prix de la crypto */}
                </div>
            );
        },
    },
    {
        field: 'stripe',
        headerName: 'Receipt URL',
        width: 250,
        renderCell: (params) => {
            const order = params.row;
            const receiptUrl = order.stripe ? order.stripe.receipt_url : null;
            return (
                <div>
                    {receiptUrl && <a href={receiptUrl}>Cliquez pour voir la facture</a>}
                </div>
            );
        },
    },
];

export default function TransactionData() {

    const [tableData, setTableData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`${BASE_URL}/api/getorders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            const data = response.data;
            console.log(data)

            if (data.length === 0) {
                setErrorMessage('Aucune transaction n\'a été effectuée pour le moment.');
            } else {
                setTableData(data);
                setErrorMessage('');
            }

            setLoading(false);

        } catch (err) {
            console.error(err);

            if (err.response && err.response.status === 401) {
                setErrorMessage('Vous devez être connecté pour voir les transactions.');
            } else {
                setErrorMessage('Une erreur est survenue.');
            }

            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const rows = tableData;

    return (
        <div style={{
            width: '85%', display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
            marginTop: '40px',
            flexDirection: 'column',
            fontFamily: 'Poppins'
        }}>



            {errorMessage ? (
                <Typography variant="h6" color="error" style={{ marginTop: '20px' }}>
                    {errorMessage}
                </Typography>
            ) : (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 15 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    autoWidth
                    autoHeight
                    loading={rows.length === 0}
                />
            )}
        </div>
    );
}
