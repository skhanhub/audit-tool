import React, {useEffect, useState} from 'react';
import {Table, Badge , Button} from "react-bootstrap"
import { StickyTable, Row, Cell } from 'react-sticky-table';
import ConfigModal from "../ConfigModal"
import "./ConfigTable.css"
import "./table.css"
import API from "../../utils/API";

const tableStyle = {
  width: '100%', 
  height: '70vh',
  marginTop: "4rem",
}

const tableCellStyle = {
  backgroundColor: "#343a40",
}
export default function ConfigTable({configs: {configs, colHeader, rowHeaders, master, comments, env, subCategory, serverType}, loading, hostName}) {

  const [modal, setModal] = useState({
    show: false,
    src: null,
    master: null,
  });
  const [allComments, setAllComments] = useState((comments && comments.comments) || {})
  useEffect(()=>{
    console.log({configs, colHeader, rowHeaders, master})
  },[configs])
  
  const compareConfig = (src, master, path, masterHost, host) => {
    console.log({src, master})
    setModal({
      show: true,
      src: src,
      master: master,
      leftTitle: masterHost,
      rightTitle: host,
      path
    });
  }
  const handleSubmit = (path, comment) => {

    console.log({comment, path, allComments})
    
    let temp = {...allComments, [path]: comment}
    // if(allComments[path]){
    //   temp ={...allComments[path], [path]: {...comment, [modalHeader]: comment}};
    // }else{
    //   temp ={[path]: {...comment, [modalHeader]: comment}};
    // }
    const payload = {
      comments: temp,
      env,
      subCategory, 
      serverType
    }
    console.log(payload)
    API.saveComments(payload)
    setAllComments(temp)
    
  }
  const handleClose = () => setModal({
    ...modal,
    show: false
  });

  const diff = (path, src, master)=>{

    if(allComments[path]){
      const srcList = configs[src][path].split("\n");
      const masterList = configs[master][path].split("\n");
      for(let i = 0; i < masterList.length; i++){
        const comment = allComments[path][masterList[i].split("=")[0]];
        if(path === "Applications;WebContainer;Tomcat;Executors;CTI;ThreadPool;UsageThreshold"){
          console.log({subPath: masterList[i].split("=")[0], path, comment: allComments[path][masterList[i].split("=")[0]], src: srcList[i], master: masterList[i]})
        }
        if((i<srcList.length)){
          if(comment){
            if(comment.compare){
              if(srcList[i].localeCompare(masterList[i])!==0){
                return false
              }
            }
          }else if(srcList[i].localeCompare(masterList[i])!==0){
            return false
          }
        }
      }
      return true
    }else if(configs[src][path].localeCompare(configs[master][path])===0){
      return true
    }else{
      return false
    }
    
  }
  const generateRows = (path, allComments)=>{
    let match = -1;
    const comp = colHeader.map((header, index)=>{
      let icon = null;
      let color = null;
      if(!configs[header][path]){
        icon = "!";
        color = "red"
      }else if(diff(path, header, master, allComments)){
        icon = "✓"
        color = "green"
        match = match + 1;
      }else{
        icon = "⤫"
        color = "red"
      }
      return (
        <td 
          onClick={()=>{
            if(configs[header][path] == false || configs[master][path] == false) return
            compareConfig(configs[header][path], configs[master][path], path, master, header)
          }} 
          key={header+index} 
          style={{backgroundColor: "#343a40", color:color, fontSize: "1.2rem", fontWeight: "bold"}}
        >
          {icon}
        </td>
      )
    })
  return [<td id="rowHeader" style={{backgroundColor: "#343a40", color: `${match === colHeader.length-1 ? "white": "red"}`}} >{path}</td>, <td id="matchRow" style={{backgroundColor: "#343a40", color: `${match === colHeader.length-1 ? "white": "red"}`}} >{match}/{colHeader.length-1}</td>, ...comp]
  }
  return (
    <>
    <div style={{marginTop: "5rem"}}>
      {hostName&&<h1><Badge >{hostName}</Badge ></h1>}
     {modal.show?
     <ConfigModal
      data={modal}
      comments={allComments}
      handleSubmit={handleSubmit}
      handleClose={handleClose}
     />
     :<div className={"tableFixHead"}style={tableStyle}>
     <Table 
variant='dark' striped bordered hover
     >
       <thead>
        <tr>
          <th id="colHeader" style={{backgroundColor: "#343a40", fontWeight: "bold"}}>Path</th>
          <th id="match" style={{backgroundColor: "#343a40", fontWeight: "bold"}}>Match</th>
          {colHeader.map((header)=><th className="rotate" style={{backgroundColor: "#343a40", fontWeight: "bold"}} key={header}><div>
                    <span>{header}</span>
                  </div></th>)}
        </tr>
       </thead>

        {rowHeaders.map((path)=>{
          return (
            <tr key={path}>
              {generateRows(path, allComments)}
            </tr>
          )
        })}
    </Table>
    </div>}
    </div>
    </>
  );
}
