import React, {useEffect, useState} from 'react';
import {Table, Badge , Button} from "react-bootstrap"
import { StickyTable, Row, Cell } from 'react-sticky-table';
import ConfigModal from "../ConfigModal"
import "./ConfigTable.css"
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
     :<div style={tableStyle}>
     <StickyTable className="auditTable">
        <Row>
          <Cell id="rowHeader" style={{backgroundColor: "#343a40", textAlign: "center", fontWeight: "bold"}}>Path</Cell>
          {colHeader.map((header)=><Cell style={{backgroundColor: "#343a40", fontWeight: "bold"}} key={header}>{header}</Cell>)}
        </Row>
        {rowHeaders.map((path)=>{
          return (
            <Row key={path}>
              <Cell id="rowHeader" style={tableCellStyle} >{path}</Cell>
              {colHeader.map((header, index)=>{
                let icon = null;
                let color = null;
                if(!configs[header][path]){
                  icon = "!";
                  color = "red"
                }else if(configs[header][path].localeCompare(configs[master][path])===0){
                  icon = "✓"
                  color = "green"
                }else{
                  icon = "⤫"
                  color = "red"
                }
                return (
                  <Cell 
                    onClick={()=>compareConfig(configs[header][path], configs[master][path], path, master, header)} 
                    key={header+index} 
                    style={{backgroundColor: "#343a40", color:color, fontSize: "1.2rem", fontWeight: "bold"}}
                  >
                    {icon}
                  </Cell>
                )
              })}
            </Row>
          )
        })}
    </StickyTable>
    </div>}
    </div>
    </>
  );
}
