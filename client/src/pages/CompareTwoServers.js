import React, { useEffect, useState } from "react";
import { Col, Spinner, Container } from "react-bootstrap";
import moment from 'moment'

import CompareTwoServersForm from "../components/CompareTwoServersForm";
import ConfigTable from "../components/ConfigTable";
import API from "../utils/API";
import {sortFunction} from "../utils";

export default function Audit(props) {

  const [selectedA, setSelectedA] = useState({
    env: null,
    subCategory: null,
    serverType: null,
    host: null,
    date: null,
  })
  const [selectedB, setSelectedB] = useState({
    env: null,
    subCategory: null,
    serverType: null,
    host: null,
    date: null,
  })
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [configs, setConfigs] = useState(null);
  

  useEffect(()=>{
      loadOptions()
  },[])


  async function loadOptions() {
      try{
        console.log("loadOptions")
          const result = await API.getOptions()
          const data = result.data
          setOptions(data)
          console.log({data})
          const env = data.env[0]
          const subCategory = data[env].subCategory[0]
          const serverType = data[env][subCategory].serverType[0]
          const hostName = data[env][subCategory][serverType].hostNames
          const hostA = hostName[0]
          const hostB = hostName.length > 1 ? hostName[1] : hostName[0]
          setSelectedA({
            env,
            subCategory,
            serverType,
            hostName,
            host:hostA,
            date: moment().format("YYYY-MM-DD"),
          })
          setSelectedB({
            env,
            subCategory,
            serverType,
            hostName,
            host:hostB,
            date: moment().format("YYYY-MM-DD"),
          })
      }
      catch(err){
          console.log(err)
      }
  };

  const handleInputChangeA = (event) =>{
    const { name, value } = event.target;
    switch(name){
      case "env":{
        console.log("env")
        const subCategory = options[value].subCategory[0]
        const serverType = options[value][subCategory].serverType[0]
        const hostName = options[value][subCategory][serverType].hostNames
        const host = hostName[0]
        setSelectedA({
          ...selectedA,
          env: value,
          subCategory,
          serverType,
          host,
        })
        break
      }
      case "subCategory":{
        console.log("subCategory")
        const subCategory = value
        const serverType = options[selectedA.env][subCategory].serverType[0]
        const hostName = options[selectedA.env][subCategory][serverType].hostNames
        const host = hostName[0]
        setSelectedA({
          ...selectedA,
          subCategory: subCategory,
          serverType: serverType,
          hostName: hostName,
          host,
        })
        break
      }
      case "serverType":{
        console.log("serverType")
        const serverType = value
        const hostName = options[selectedA.env][selectedA.subCategory][serverType].hostNames
        const host = hostName[0]
        setSelectedA({
          ...selectedA,
          serverType,
          host,
        })
        break
      }
      default:{
        setSelectedA({
          ...selectedA,
          [name]: value,
        })
        break
      }
    } 
  }
  const handleInputChangeB = (event) =>{
    const { name, value } = event.target;
    switch(name){
      case "env":{
        console.log("env")
        const subCategory = options[value].subCategory[0]
        const serverType = options[value][subCategory].serverType[0]
        const hostName = options[value][subCategory][serverType].hostNames
        const host = hostName[0]
        setSelectedB({
          ...selectedB,
          env: value,
          subCategory,
          serverType,
          host,
        })
        break
      }
      case "subCategory":{
        console.log("subCategory")
        const subCategory = value
        const serverType = options[selectedB.env][subCategory].serverType[0]
        const hostName = options[selectedB.env][subCategory][serverType].hostNames
        const host = hostName[0]
        setSelectedB({
          ...selectedB,
          subCategory: subCategory,
          serverType: serverType,
          hostName: hostName,
          host,
        })
        break
      }
      case "serverType":{
        console.log("serverType")
        const serverType = value
        const hostName = options[selectedB.env][selectedB.subCategory][serverType].hostNames
        const host = hostName[0]
        setSelectedB({
          ...selectedB,
          serverType,
          host,
        })
        break
      }
      default:{
        setSelectedB({
          ...selectedB,
          [name]: value,
        })
        break
      }
    } 
  }
  const compareConfigs = async () => {
    setLoading(true)
    setError(null)
    setConfigs(null)
    const fromTimeA = moment(selectedA.date, "YYYY-MM-DD").valueOf()/1000
    const toTimeA = fromTimeA + 86400
    const fromTimeB = moment(selectedB.date, "YYYY-MM-DD").valueOf()/1000
    const toTimeB = fromTimeB + 86400
    const filter = {
      selectedA:{
        ...selectedA,
        hostName: selectedA.host,
        fromTime: fromTimeA,
        toTime: toTimeA,
      },
      selectedB:{
        ...selectedB,
        hostName: selectedB.host,
        fromTime: fromTimeB,
        toTime: toTimeB,
      },
      type: "TWO_SERVERS"
    }
    let result;
    try{
      result = await API.getConfigs(filter)
    }catch(err){
      setError(err.message)
      setLoading(false)
      return
    }
    console.log(result.data)
    if(result.data.length < 2){
      setError("Could Not Find Any Matching Data")
      setLoading(false)
      return
    }
    const configs = {}
    for(let config of result.data){
      configs[config.hostName] = config.config
    }
    const master = result.data[0].hostName
    const masterConfig = result.data[0]
    const rowHeaders = Object.keys(masterConfig.config).sort(sortFunction);
    const colHeader = result.data.sort(sortFunction).map((config)=>config.hostName);

    try{
      result = await API.getComments(selectedA)
    }catch(err){
      setError(err.message)
      setLoading(false)
      return
    }
    console.log(result.data)
    setConfigs({
      configs,
      colHeader,
      rowHeaders,
      master,
      comments: result.data,
      env: selectedA.env,
      subCategory: selectedA.subCategory,
      serverType: selectedA.serverType,
    })
    setLoading(false)
  }
  
  return (
        <Container fluid>
          <CompareTwoServersForm 
            selectedA={selectedA}
            selectedB={selectedB}
            options={options}
            handleInputChangeA={handleInputChangeA}
            handleInputChangeB={handleInputChangeB}
            compareConfigs={compareConfigs}  
            loading={loading}    
          />
          
          {loading?
            <Spinner animation="border" role="status" style={{display: "block", margin: "10rem auto", textAlign: "center"}}>
              <span className="sr-only">Loading...</span>
            </Spinner>
            :
            <div>
              {configs&&<ConfigTable
                configs={configs}
                loading={loading}
              />}
              {error&&<h3 
                style={{
                  color:"red",
                  margin: "10rem auto",
                  textAlign: "center"
                }}
              >
                {error}
              </h3>}
            </div>
          }
        </Container>
    );
}

