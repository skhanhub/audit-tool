import React, { useEffect, useState } from "react";
import { Col, Spinner, Container } from "react-bootstrap";
import moment from 'moment'

import CompareByTimeForm from "../components/CompareByTimeForm";
import ConfigTable from "../components/ConfigTable";
import API from "../utils/API";
import {sortFunction} from "../utils";

export default function Audit(props) {

  const [selected, setSelected] = useState({
    env: null,
    subCategory: null,
    serverType: null,
    hostName: null,
    fromDate: null,
    toDate: null,
    timeline: false
  })
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [configs, setConfigs] = useState(null);
  const [hostName, setHostName] = useState(null)
  

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
        const hostName = data[env][subCategory][serverType].hostNames[0]
        const fromDate = moment().add(-1, 'days').format("YYYY-MM-DD")
        const toDate = moment().format("YYYY-MM-DD")
        setSelected({
          env,
          subCategory,
          serverType,
          hostName,
          fromDate,
          toDate,
          timeline: false
        })
      }
      catch(err){
          console.log(err)
          setError(err.message)
      }
  };

  const handleInputChange = (event) =>{
    const { name, value } = event.target;
    switch(name){
      case "env":{
        console.log("env")
        const subCategory = options[value].subCategory[0]
        const serverType = options[value][subCategory].serverType[0]
        const hostName = options[value][subCategory][serverType].hostNames[0]
        setSelected({
          ...selected,
          env: value,
          subCategory: subCategory,
          serverType: serverType,
          hostName: hostName,
        })
        break
      }
      case "subCategory":{
        console.log("subCategory")
        const subCategory = value
        const serverType = options[selected.env][subCategory].serverType[0]
        const hostName = options[selected.env][subCategory][serverType].hostNames[0]
        setSelected({
          ...selected,
          subCategory: subCategory,
          serverType: serverType,
          hostName: hostName,
        })
        break
      }
      case "serverType":{
        console.log("serverType")
        const serverType = value
        const hostName = options[selected.env][selected.subCategory][serverType].hostNames[0]
        setSelected({
          ...selected,
          serverType: serverType,
          hostName: hostName,
        })
        break
      }
      case "hostName":{
        console.log("hostName")
        setSelected({
          ...selected,
          hostName: value,
        })
        break
      }
      case "timeline":{
        console.log("timeline")
        setSelected({
          ...selected,
          timeline: event.target.checked,
        })
        break
      }
      default:{
        setSelected({
          ...selected,
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
    setHostName(selected.hostName)
    const fromTimeA = moment(selected.fromDate, "YYYY-MM-DD").valueOf()/1000
    const toTimeA = fromTimeA + 86400
    const fromTimeB = moment(selected.toDate, "YYYY-MM-DD").valueOf()/1000
    const toTimeB = fromTimeB + 86400
    let filter = {
      ...selected,

      type: "COMPARE_BY_TIME"
    }
    if(selected.timeline){
      filter = {
        ...filter,
        fromTime: fromTimeA,
        toTime: fromTimeB,
      }
    }
    else{
      filter = {
        ...filter,
        fromTimeA,
        toTimeA,
        fromTimeB,
        toTimeB,
      }
    }

    console.log({filter})
    let result;
    try{
      result = await API.getConfigs(filter)
    }catch(err){
      setError(err.message)
      setLoading(false)
      return
    }
    console.log(result.data)

    if(result.data.length < 2 ){
      setError("Could Not Find Matching Data. Try A Different Date Range")
      setLoading(false)
      return
    }
    const configs = {}
    for(let config of result.data){
      configs[moment.unix(config.time).format("DD-MM-YYYY")] = config.config
    }
    const master = moment.unix(result.data[0].time).format("DD-MM-YYYY")
    const masterConfig = result.data[0]
    const rowHeaders = Object.keys(masterConfig.config).sort(sortFunction);
    const colHeader = result.data.sort(sortFunction).map((config)=>moment.unix(config.time).format("DD-MM-YYYY"));

    try{
      result = await API.getComments(selected)
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
      env: selected.env,
      subCategory: selected.subCategory,
      serverType: selected.serverType,
    })
    setLoading(false)
  }
  
  return (
        <Container fluid>
          <CompareByTimeForm 
            selected={selected}
            options={options}
            handleInputChange={handleInputChange}
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
                hostName={hostName}
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

