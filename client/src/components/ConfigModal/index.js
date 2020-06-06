import React, {useEffect, useState} from 'react';

import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import {Container, Col, Row, Button, Table, Modal, Form} from "react-bootstrap"
import "./ConfigModal.css"


const diffStyle = {
  width: '100%', 
  height: '70vh',
  marginTop: "4rem",
}

export default function ConfigTable({data, handleClose, comments, env, subCategory, serverType, handleSubmit}) {
    
  useEffect(()=>{
    console.log(data, comments)
  },[data])
  const [show, setShow] = useState(false);
  const [modalHeader, setModalHeader] = useState(null);
  const [comment, setComment] = useState(comments[data.path] || {});
  const [selected, setSelected] = useState({
    comment: "",
    compare: true,
  });

  const closeModal = () => setShow(false);
  const openModal = () => setShow(true);

  const commentModal = (src, dest, comment)=>{
    setSelected({
      comment: comment[src.split("=")[0]]?comment[src.split("=")[0]].comment:"",
      compare: comment[src.split("=")[0]]?comment[src.split("=")[0]].compare:true,
    })
    if(src.split("=").length === 2){
      setModalHeader(src.split("=")[0])
      
      openModal()
      console.log("can comment")
    }
  }
  const diff = (src, dest, line, comment)=>{
    let srcComp = ``;
    let destComp = ``;
    let flag = false;
    for(let i = 0; i < src.length; i++){
      if(i <dest.length){
        if(src[i]===dest[i]){
          srcComp += src[i];
          destComp += dest[i]
        }else{
          flag = true;
          srcComp += `<span style="background-color:#7d383f">${src[i]}</span>`
          destComp += `<span style="background-color:	#055d67	">${dest[i]}</span>`
        }
      }else{
        flag = true;
        srcComp += `<span style="background-color:#7d383f">${src[i]}</span>`
        destComp += `<span style="background-color:	#055d67	"></span>`
      }
    }

    const stripe = (comment[src.split("=")[0]]&&!comment[src.split("=")[0]].compare)
    return [<td className={`${stripe?'stripe':''}`} key={line}>{line}</td>,<td className={`${stripe?'stripe':''}`} style={{background: flag?'#632f34':'', color:"white"}} key={srcComp} dangerouslySetInnerHTML={{__html:srcComp}}/>,<td className={`${stripe?'stripe':''}`} style={{background: flag?'#044b53':'', color:"white"}} key={destComp} dangerouslySetInnerHTML={{__html:destComp}}/>,<td onClick={()=>commentModal(src, dest, comment)} key={Math.random()}>{comment[src.split("=")[0]]?comment[src.split("=")[0]].comment:""}</td>]
  }
  return (
    <>
      <Button style={{textAlign: 'center', margin:"2rem 2rem 0 0", width: "200px"}} onClick={handleClose}>Back</Button>
      <h1 style={{textAlign: 'center', margin:"2rem"}}>{data.path}</h1>
      <div style={diffStyle}>
      <Table variant="dark" striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>{data.leftTitle}</th>
            <th>{data.rightTitle}</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {data.master.split("\n").map((master,i)=>{
            return (
              <tr key={i}>
                {diff(master, data.src?data.src.split("\n")[i]:[], i, comment)}
              </tr>
            )
          })}
        </tbody>
      </Table>
      </div>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>  
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Comment</Form.Label>
            <Form.Control onChange={(event)=>{setSelected({...selected, comment: event.target.value})}} name="comment" value={selected.comment} type="text"/>
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check onChange={(event)=>{setSelected({...selected, compare: event.target.checked})}} name="compare" checked={selected.compare} type="checkbox" label="Compare" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{
            handleSubmit(data.path, {...comment, [modalHeader]:{comment: selected.comment, compare: selected.compare}})
            setComment({...comment, [modalHeader]:{comment: selected.comment, compare: selected.compare}})
            closeModal()
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

{/* <ReactDiffViewer
useDarkTheme
oldValue={data.master}
newValue={data.src}
// compareMethod={DiffMethod.WORDS}
splitView={true}
showDiffOnly={false}
leftTitle={data.leftTitle}
rightTitle={data.rightTitle}
styles={{variables: { dark: { diffViewerTitleColor: "white"}}}}
/> */}