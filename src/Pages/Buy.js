import React from 'react'
import CustomizedTabs from '../Components/StyledTabs'
import Header from '../Components/Header'

const Buy = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: 'column',
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%"
        }}
        >
            <Header />
            <CustomizedTabs />


        </div>
    )
}

export default Buy
