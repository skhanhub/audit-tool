import React, { useEffect, useState } from "react";
import { Col, Spinner, Container } from "react-bootstrap";
import moment from 'moment'

import AuditForm from "../components/AuditForm";
import ConfigTable from "../components/ConfigTable";
import API from "../utils/API";

export default function Audit(props) {

  const [selected, setSelected] = useState({
    env: null,
    subCategory: null,
    serverType: null,
    hostName: null,
    date: null,
    master: null,
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
          const master = data[env][subCategory][serverType].master
          setSelected({
            env,
            subCategory,
            serverType,
            hostName,
            date: moment().format("YYYY-MM-DD"),
            master
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
        const master = options[value][subCategory][serverType].master
        setSelected({
          ...selected,
          env: value,
          subCategory: subCategory,
          serverType: serverType,
          hostName: hostName,
          master: master
        })
        break
      }
      case "subCategory":{
        console.log("subCategory")
        const subCategory = value
        const serverType = options[selected.env][subCategory].serverType[0]
        const hostName = options[selected.env][subCategory][serverType].hostNames
        const master = options[selected.env][subCategory][serverType].master
        
        setSelected({
          ...selected,
          subCategory: subCategory,
          serverType: serverType,
          hostName: hostName,
          master: master
        })
        break
      }
      case "serverType":{
        console.log("serverType")
        const serverType = value
        const hostName = options[selected.env][selected.subCategory][serverType].hostNames
        const master = options[selected.env][selected.subCategory][serverType].master
        setSelected({
          ...selected,
          serverType: serverType,
          hostName: hostName,
          master: master,
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
      case "date":{
        console.log("date")
        setSelected({
          ...selected,
          date: value,
        })
        break
      }
      default:{
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
      fromTime: fromTime,
      toTime: toTime,
      type: "MULTIPLE_SERVERS"
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
    if(result.data.length === 0){
      setError("Could Not Find Any Matching Data")
      setLoading(false)
      return
    }
    const configs = {}
    for(let config of result.data){
      configs[config.hostName] = config.config
    }
    const master = selected.master?selected.master:result.data[0].hostName
    const masterConfig = result.data.find((config)=>config.hostName===master)
    const rowHeaders = Object.keys(masterConfig.config);
    const colHeader = result.data.map((config)=>config.hostName).sort(function(x,y){ return x == selected.master ? -1 : y == selected.master ? 1 : 0; });

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
          <AuditForm 
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

