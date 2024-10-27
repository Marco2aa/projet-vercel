import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import './DataGrid.css'
import { LinearProgress } from '@mui/material';
import { BASE_URL } from '../../config/api';

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 70
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 250
    },
    {
        field: 'top3Coins', headerName: 'Top 3', width: 130, renderCell: (params) => {
            const top3Coins = params.value;
            return (
                <div>
                    {top3Coins.map((coinUrl, index) => (
                        <img key={index} src={coinUrl} alt={`Coin ${index + 1}`} style={{ width: 25, height: 25 }} />
                    ))}
                </div>
            );
        },
    },
    {
        field: 'market_cap',
        headerName: 'Market Cap',
        type: 'number',
        width: 200,
        cellClassName: (params) => {
            const value = params.value;
            if (value < 0) {
                return 'negative-value';
            } else if (value > 0) {
                return 'positive-value';
            }
            return '';
        },
    },
    {
        field: 'market_cap_change_24h',
        headerName: '24h',
        type: 'number',
        width: 200,
        cellClassName: (params) => {
            const value = params.value;
            if (value < 0) {
                return 'negative-value';
            } else if (value > 0) {
                return 'positive-value';
            }
            return '';
        },
    },
    {
        field: 'volume_24h',
        headerName: 'Volume',
        type: 'number',
        width: 250,
    },
    {
        field: 'updatedAt',
        headerName: 'Update',
        width: 200,

    },

];








export default function DataTable() {

    const [tableData, setTableData] = React.useState([])
    const [loading, setLoading] = React.useState(false);

    const fetchCategorie = async () => {
        setLoading(true)
        try {
            let allCategories = [];
            for (let page = 1; page <= 8; page++) {
                const response = await axios.get(`${BASE_URL}/api/categories?page=${page}`);
                const data = response.data;
                allCategories = [...allCategories, ...data['hydra:member']];
            }

            setTableData(allCategories);
            setLoading(false)
            console.log(allCategories)
        } catch (err) {
            console.error(err)
            setLoading(false)

        }
    }

    React.useEffect(() => {
        fetchCategorie()
    }, [])

    const rows = tableData
    console.log(rows)
    return (

        <div style={{
            width: '85%', display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // minHeight: '100vh',
            margin: 'auto',
            marginTop: '40px',
            flexDirection: 'column',
            fontFamily: 'Poppins'

        }}>



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



        </div>
    );
}