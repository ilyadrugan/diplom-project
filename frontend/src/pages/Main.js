import React, { useEffect, useState } from "react";
import TrackTable from "../components/Table/Table";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./styles/PageStyles.module.css";
import urls from "../utils/urls";
import { Spinner } from "react-bootstrap";


const Main = () => {
  const user = JSON.parse(sessionStorage.getItem('_currentUser'))
  const [datePick, setDatePick] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [dateRequests, setDateRequests] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [types, setTypes] = useState([]);

  const onChangeDate = (date, requests=allRequests) =>{
    
    setDatePick(date)
    if(requests.length===0){
      return 0
    }
    setDateRequests(requests.filter((req)=>new Date(req.time_create).toLocaleDateString()===date.toLocaleDateString()))
  }

  // const getRequestsToCache =  () => {
  //   const request = new Request(urls.requests(), {method: 'GET', headers: { "X-Api-Key": "key" }});
  //   const requestPhotos = new Request(urls.photos(), {method: 'GET', headers: { "X-Api-Key": "key" }});
  //   const requestTypes = new Request(urls.types(), {method: 'GET', headers: { "X-Api-Key": "key" }});

  //   if ('caches' in window) {
  //     [request, requestPhotos,requestTypes].forEach((req, i)=>{
  //       caches.open('cacheName').then(async(cache) => {
  //         let data = await cache.match(req)
  //         if (data===undefined){
  //           data = await fetch(req).then((r) => r.json());
  //           cache.put(req.url, new Response(JSON.stringify(data.data)));
  //           if (i===0){
  //             return setAllRequests(data.data)
  //           }else if (i===1){
  //             return setPhotos(data.data)
  //           }
  //           setIsLoading(false);

  //           return setTypes(data.data)
  //         }
  //         else{
  //           data = await data.json()
  //           if (i===0){
  //             return setAllRequests(data)
  //           }
  //           else if (i===1){
  //             return setPhotos(data)
  //           }
  //           setIsLoading(false);

  //           return setTypes(data)
  //         }
  //       });
  //     })
  //   }
  // }  

  const getRequests = () => {
    fetch(urls.requests(), {
      method: "GET",
      headers: { "X-Api-Key": "key" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if(user.user_status === 'master'){
          setAllRequests(data.data)
          onChangeDate(new Date(),data.data)
        }
        else{
          const filteredByIDReqs = data.data.filter((req)=>req.user_login==user.login)
          setAllRequests(filteredByIDReqs)
          onChangeDate(new Date(),filteredByIDReqs)
        }
        getPhotos()
      })
      .catch((error) => {
        console.log("Error is : ", error);
        setIsLoading(false);
      });
  };
  const getPhotos = () => {
    fetch(urls.photos(), {
      method: "GET",
      headers: { "X-Api-Key": "key" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setPhotos(data.data)
        getTypes()
      })
      .catch((error) => {
        console.log("Error is : ", error);
        setIsLoading(false);
      });
  };
  const getTypes = () => {
    fetch(urls.types(), {
      method: "GET",
      headers: { "X-Api-Key": "key" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTypes(data.data)
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error is : ", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getRequests();
    
  }, []);
  return (
    <>
      <div className={styles.main_container}>
        {isLoading ? (
          <div style={{ paddingRight: 4, width: "100%", textAlign:"center" }}>
            <Spinner animation="border" />
          </div>
        ) : (
          <TrackTable date={datePick} requests={dateRequests} photos={photos} types={types}/>
        )}
        <div>
        <Calendar style={{maxHeight: 400}} onChange={(date)=>onChangeDate(date)} value={datePick} />

        </div>
      </div>
    </>
  );
};

export default Main;
