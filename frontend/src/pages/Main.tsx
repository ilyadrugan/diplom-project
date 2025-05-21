import React, { useEffect, useState } from "react";
import TrackTable from "../components/Table/Table";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./styles/PageStyles.module.css";
import urls from "../utils/urls";
import { Spinner } from "react-bootstrap";
import userStore from "../stores/userStore/UserStore";
import requestStore from "../stores/requestStore/requestStore";
import { observer } from "mobx-react";


const Main = observer(() => {
  const [datePick, setDatePick] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [dateRequests, setDateRequests] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [types, setTypes] = useState([]);

  const onChangeDate = (date) =>{
    console.log('date', date)
    setDatePick(date)
    requestStore.filterByDate(date)
  }

  const getRequests = async () => {
    await requestStore.getRequests()
    if(userStore.user.user_status === 'W'){
      requestStore.filterByLogin(userStore.user.login)
    }
     onChangeDate(new Date())
  };


  useEffect(() => {
    setIsLoading(true);
    getRequests();
    
  }, []);
  return (
    <>
      <div className={styles.main_container}>
        {requestStore.isLoading ? (
          <div style={{ paddingRight: 4, width: "100%", textAlign:"center" }}>
            <Spinner animation="border" />
          </div>
        ) : (
          <TrackTable requests={requestStore.requestsFilteredList} date={datePick}/>
        )}
        <div>
        <Calendar style={{maxHeight: 400}} onChange={(date)=>onChangeDate(date)} value={datePick} />

        </div>
      </div>
    </>
  );
});

export default Main;
