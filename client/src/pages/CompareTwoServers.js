import React, { useEffect, useState } from "react";
import { Col, Spinner, Container } from "react-bootstrap";
import moment from 'moment'

import CompareTwoServersForm from "../components/CompareTwoServersForm";
import ConfigTable from "../components/ConfigTable";
import API from "../utils/API";

export default function Audit(props) {

  const [selected, setSelected] = useState({
    env: null,
    subCategory: null,
    serverType: null,
    hostA: null,
    hostB: null,
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
          setSelected({
            env,
            subCategory,
            serverType,
            hostName,
            hostA,
            hostB,
            date: moment().format("YYYY-MM-DD"),
          })
      }
      catch(err){
          console.log(err)
      }
  };

  const handleInputChange = (event) =>{
    const { name, value } = event.target;
    switch(name){
      case "env":{
        console.log("env")
        const subCategory = options[value].subCategory[0]
        const serverType = options[value][subCategory].serverType[0]
        const hostName = options[value][subCategory][serverType].hostNames
        const hostA = hostName[0]
        const hostB = hostName.length > 1 ? hostName[1] : hostName[0]
        setSelected({
          ...selected,
          env: value,
          subCategory,
          serverType,
          hostA,
          hostB,
        })
        break
      }
      case "subCategory":{
        console.log("subCategory")
        const subCategory = value
        const serverType = options[selected.env][subCategory].serverType[0]
        const hostName = options[selected.env][subCategory][serverType].hostNames
        const hostA = hostName[0]
        const hostB = hostName.length > 1 ? hostName[1] : hostName[0]
        setSelected({
          ...selected,
          subCategory: subCategory,
          serverType: serverType,
          hostName: hostName,
          hostA,
          hostB,
        })
        break
      }
      case "serverType":{
        console.log("serverType")
        const serverType = value
        const hostName = options[selected.env][selected.subCategory][serverType].hostNames
        const hostA = hostName[0]
        const hostB = hostName.length > 1 ? hostName[1] : hostName[0]
        setSelected({
          ...selected,
          serverType,
          hostA,
          hostB,
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
    const fromTime = moment(selected.date, "YYYY-MM-DD").valueOf()/1000
    const toTime = fromTime + 86400
    const filter = {
      ...selected,
      hostName: [selected.hostA, selected.hostB],
      fromTime: fromTime,
      toTime: toTime,
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
    const rowHeaders = Object.keys(masterConfig.config);
    const colHeader = result.data.map((config)=>config.hostName);

    setConfigs({
      configs,
      colHeader,
      rowHeaders,
      master,
    })
    setLoading(false)
  }
  
  return (
        <Container fluid>
          <CompareTwoServersForm 
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

