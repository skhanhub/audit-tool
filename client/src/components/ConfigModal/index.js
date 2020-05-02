import React, {useEffect, useState} from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import {Container, Col, Row, Button} from "react-bootstrap"

const diffStyle = {
  width: '100%', 
  height: '70vh',
  marginTop: "4rem",
}
export default function ConfigTable({data, handleClose}) {
    
  useEffect(()=>{
    console.log(data)
  },[data])
  
  return (
    <>
      <Button style={{textAlign: 'center', margin:"2rem 2rem 0 0", width: "200px"}} onClick={handleClose}>Back</Button>
      <h1 style={{textAlign: 'center', margin:"2rem"}}>{data.path}</h1>
      <div style={diffStyle}>
        <ReactDiffViewer
          useDarkTheme
          oldValue={data.master}
          newValue={data.src}
          // compareMethod={DiffMethod.WORDS}
          splitView={true}
          showDiffOnly={false}
          leftTitle={data.leftTitle}
          rightTitle={data.rightTitle}
          styles={{variables: { dark: { diffViewerTitleColor: "white"}}}}
        />
      </div>
    </>
  );
}
