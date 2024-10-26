import React from 'react'
import Banner from "../Components/Banner/Banner.js"
import CoinsTable from '../Components/CoinsTable.js'
import Footer from '../Components/Footer.js'
import { Link } from 'react-router-dom'
import Header from '../Components/Header.js'
import ApexChart from "../Components/ApexChart.js"


const Homemap = () => {
    return (
        <>
            <Header />
            <Banner />
            <ApexChart />

        </>
    )
}

export default Homemap
