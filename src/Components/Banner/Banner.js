import { makeStyles } from '@mui/styles'
import { Container} from '@mui/material'
import React from 'react'
import { Typography } from '@material-ui/core'
import Carousel from './Carousel'

const useStyles = makeStyles(() =>({
    banner:{
        backgroundImage : "url(./banner2.jpg)",
        width:'100%'
    },
    bannerContent:{
        height:350,
        display: "flex",
        flexDirection: "column",
        paddingTop: 25,
        justifyContent: "space-around",
    },
    tagline: {
        display:"flex",
        // height:"40%",
        flexDirection:"column",
        justifyContent:"center",
        textAlign:"center",
        fontWeight: "bold",
        // marginBottom :15,
        fontFamily:"Montserrat",
        fontSize: "2em"
    }

}))

const Banner = () => {
    const classes = useStyles();

  return (
    <div className={classes.banner}>
        <div className={classes.bannerContent}>
            <div className={classes.tagline}>
                {/* <Typography
                variant="h3"
                style={{
                    fontWeight: "bold",
                    marginBottom :15,
                    fontFamily:"Montserrat",
                }}> */}
                
                    Top 10 Tendances

                
                {/* </Typography> */}
            </div>
            <Carousel />
        </div>
    </div>
  )
}

export default Banner 
