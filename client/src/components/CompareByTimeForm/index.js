import React, {useEffect, useState} from 'react';
import {Form, Col, Button} from "react-bootstrap"
import { Multiselect } from 'multiselect-react-dropdown';

import {sortFunction} from "../../utils"

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
          {options.env&&options.env.sort(sortFunction).map((env)=><option key={env} value={env} onChange={handleInputChange}>{env}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Sub Category</Form.Label>
      <Form.Control name="subCategory" as="select" onChange={handleInputChange} value={selected.subCategory}>
          {selected.env&&options[selected.env].subCategory.sort(sortFunction).map((subCategory)=><option key={subCategory} value={subCategory}>{subCategory}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Server Type</Form.Label>
      <Form.Control name="serverType" as="select" onChange={handleInputChange} value={selected.serverType}>
          {selected.env&&options[selected.env][selected.subCategory].serverType.sort(sortFunction).map((serverType)=><option  key={serverType} value={serverType}>{serverType}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Hostname</Form.Label>
      <Form.Control name="hostName" as="select" onChange={handleInputChange} value={selected.hostName}>
          {selected.env&&options[selected.env][selected.subCategory][selected.serverType].hostNames.map((hostName)=><option  key={hostName} value={hostName}>{hostName}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="validationFormik01">
      <Form.Label>Date A</Form.Label>
      <Form.Control
        type="date"
        name="fromDate"
        defaultValue={selected.fromDate}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group as={Col} controlId="validationFormik01">
      <Form.Label>Date B</Form.Label>
      <Form.Control
        type="date"
        name="toDate"
        defaultValue={selected.toDate}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group as={Col} controlId="validationFormik01">
      <Form.Label>Timeline</Form.Label>
      <Form.Check
        required
        name="timeline"
        onChange={handleInputChange}
        defaultValue={selected.timeline}
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
