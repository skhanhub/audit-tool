import React, {useEffect, useState} from 'react';
import {Form, Col, Button} from "react-bootstrap"
import { Multiselect } from 'multiselect-react-dropdown';



export default function AuditForm({options, selected, handleInputChange, compareConfigs, loading}) {
    

  useEffect(()=>{
    console.log({selected, options})
  }, [selected])

  
  const onSelect = (selectedList, selectedItem) => {
    const target = {name: null, value: []}
    const event = {target}
    event.target.name = "hostName"
    event.target.value = selectedList

    handleInputChange(event)
  }
  return (
    <>
    <Form.Row>
    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Environment</Form.Label>
      <Form.Control name="env" as="select" onChange={handleInputChange} value={selected.env}>
          {options.env&&options.env.map((env)=><option key={env} value={env} onChange={handleInputChange}>{env}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Sub Category</Form.Label>
      <Form.Control name="subCategory" as="select" onChange={handleInputChange} value={selected.subCategory}>
          {selected.env&&options[selected.env].subCategory.map((subCategory)=><option key={subCategory} value={subCategory}>{subCategory}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Server Type</Form.Label>
      <Form.Control name="serverType" as="select" onChange={handleInputChange} value={selected.serverType}>
          {selected.env&&options[selected.env][selected.subCategory].serverType.map((serverType)=><option  key={serverType} value={serverType}>{serverType}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Host A</Form.Label>
      <Form.Control name="hostA" as="select" onChange={handleInputChange} value={selected.hostA}>
          {selected.env&&options[selected.env][selected.subCategory][selected.serverType].hostNames.map((hostName)=><option  key={hostName} value={hostName}>{hostName}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Host B</Form.Label>
      <Form.Control name="hostB" as="select" onChange={handleInputChange} value={selected.hostB}>
          {selected.env&&options[selected.env][selected.subCategory][selected.serverType].hostNames.map((hostName)=><option  key={hostName} value={hostName}>{hostName}</option>)}
      </Form.Control>
    </Form.Group>


    <Form.Group as={Col} controlId="validationFormik01">
      <Form.Label>Date</Form.Label>
      <Form.Control
        type="date"
        name="date"
        defaultValue={selected.date}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group as={Col} controlId="formGridZip">
      <Button 
        style={{marginTop:"2rem"}}
        variant="primary" 
        type="submit"
        onClick={compareConfigs}
        disabled={loading}
      >
        Compare
      </Button>
    </Form.Group>
  </Form.Row>
  </>
  );
}
