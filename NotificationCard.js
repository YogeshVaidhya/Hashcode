import React, { useEffect } from "react";
import dimg from "../../assets/img/dimg.png";
import image1 from "../../assets/img/innovation.png";
import Card from "@material-ui/core/Card";
import Allnotifications from "./Allnotifications";
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import { useState } from "react";
import styles from "assets/jss/material-kit-react/views/notificationCard.js";
import { Button } from "@material-ui/core";

// Library for time ago from TimeStamp  
import JavascriptTimeAgo from 'javascript-time-ago';
import ReactTimeAgo from 'react-time-ago';

// english
import en from 'javascript-time-ago/locale/en';
JavascriptTimeAgo.addLocale(en);

const useStyles = makeStyles(styles);

const Content = props => {
  switch (props.notificationtype) {
    case 'Welcome':
      return `Welcome to MyHashCode, ${props.username}`;
    case 'Job Post':
      return `There is a job opening in ${props.companyname}`;
    case 'New Registration':
      return `${props.username} is registered to Job Seekar Program`;
    case 'Application Status':
      return `Your Application in ${props.companyname} is ${props.status}`;
    default:
      return '';
  }
};

const ButtonContent = type => {
  switch (type) {
    case 'Welcome':
      return `View Your Profile`;
    case 'Job Post':
      return 'View Job Description';
    case 'View Course':
      return 'View User Profile';
    case 'Application Status':
      return 'View Status';
    default:
      return '';
  }
}

export default function NotificationCard() {
  const classes = useStyles();
  const [isLoading, setIsLoading] = React.useState(true);
  // const [allnotification,setAllnotification] = React.useState([]);
  var allnotification = [];
  const [state, setState] = React.useState(allnotification);
  const [btnValue, setBtnValue] = useState(1);

  useEffect(()=>{
    async function fetchData(){
        const url = 'https://52.165.147.19/api/v2/notifications';
        const param = {
            method: 'GET',
            'Content-Type': 'application/json'
        };
        let response = await fetch(url,param);
        let data = await response.json();
        // setAllnotification(data);
        allnotification = data;
        setState(allnotification);
        setIsLoading(false)
    }
    fetchData();
  },[]);

  const MakeCard = data => {
    return (
      <>
        <Card className={`${classes.root} ${data.read === true ? classes.read : classes.unread}`} variant="outlined">
          <Avatar src={data.imageurl} alt="dimg" className={classes.avatar}></Avatar>
          <div className={classes.details}>
            <div className={classes.content}>
              <Typography component="h5" variant="h5">
                {`${data.type} ${data.operation}`}
              </Typography>
              <Typography variant="subtitle1" className={classes.textr}>
                {data.textMessage}
              </Typography>
            </div>

            {data.links.length>0 &&
              <a href={data.links[0]}><Button variant="outlined" className={classes.btn} color='primary'>
                {`View ${data.type}`}
              </Button></a>}

          </div>
          <div className={classes.timestamp}>
            <MoreVertIcon className={classes.verticon} />
            <span className={classes.timepos}><ReactTimeAgo date={data.timestamp}/></span>
          </div>
        </Card>
      </>
    )
  };

  const handleClick = (e) => {
    var type = e.currentTarget.value;

    if (type === "All") {
      setState(allnotification);
      setBtnValue(1);
    }
    else if (type === "Job Post") {
      const filtered = allnotification.filter(item => item.notificationtype === "Job Post")
      setState(filtered);
      setBtnValue(2);
    }
    else if (type === "View Course") {
      console.log(allnotification);
      const filtered = allnotification.filter(item => item.type === "COURSE")
      setState(filtered);
      alert('hello');
      setBtnValue(3);
    }
    else if (type === "Internship") {
      const filtered = allnotification.filter(item => item.notificationtype === "Internship")
      setState(filtered);
      setBtnValue(4);
    }
    else if (type === "Startup") {
      const filtered = allnotification.filter(item => item.notificationtype === "Startup")
      setState(filtered);
      setBtnValue(5);
    }
  }

  return (
    <>
      <div className={classes.filters}>
        <Button value="All" variant="contained" onClick={handleClick} className={`${classes.filterbutton} ${btnValue === 1 ? classes.activebtn : classes.inactivebtn}`}>All</Button>
        <Button value="Job Post" variant="contained" onClick={handleClick} className={`${classes.filterbutton} ${btnValue === 2 ? classes.activebtn : classes.inactivebtn}`}>Job Post</Button>
        <Button value="View Course" variant="contained" onClick={handleClick} className={`${classes.filterbutton} ${btnValue === 3 ? classes.activebtn : classes.inactivebtn}`}>Course</Button>
        <Button Value="Internship" variant="contained" onClick={handleClick} className={`${classes.filterbutton} ${btnValue === 4 ? classes.activebtn : classes.inactivebtn}`}>Internships</Button>
        <Button Value="Startup" variant="contained" onClick={handleClick} className={`${classes.filterbutton} ${btnValue === 5 ? classes.activebtn : classes.inactivebtn}`}>Startup</Button>
      </div>
      {isLoading ? (
        <>
          <div className={classes.circularIcon}> <CircularProgress /></div>
        </>
      ) : (
        <>
          {state.length !== 0 ?
            (<>
              {state.map((notification, index) => {
                return MakeCard(notification);
              })}
            </>) :
            (
              <>
                <div className={classes.divcont}>
                  <span>There are no Notifications. </span>
                  <span>Please come back later. </span>
                </div>
              </>
            )
          }
        </>
      )}
    </>
  )
}
