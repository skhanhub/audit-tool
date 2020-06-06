import React, {useEffect, useState} from 'react';
import {Form, Col, Button} from "react-bootstrap"
import { Multiselect } from 'multiselect-react-dropdown';

import {sortFunction} from "../../utils"

export default function AuditForm({options, selectedA, selectedB, handleInputChangeA, handleInputChangeB, compareConfigs, loading}) {
    

  useEffect(()=>{
    console.log({selectedA, options})
  }, [selectedA])

  
  // const onSelect = (selectedList, selectedItem) => {
  //   const target = {name: null, value: []}
  //   const event = {target}
  //   event.target.name = "hostName"
  //   event.target.value = selectedList

  //   handleInputChange(event)
  // }
  return (
    <>
    <Form.Row>
    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Environment</Form.Label>
      <Form.Control name="env" as="select" onChange={handleInputChangeA} value={selectedA.env}>
          {options.env&&options.env.sort(sortFunction).map((env)=><option key={env} value={env} onChange={handleInputChangeA}>{env}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Sub Category</Form.Label>
      <Form.Control name="subCategory" as="select" onChange={handleInputChangeA} value={selectedA.subCategory}>
          {selectedA.env&&options[selectedA.env].subCategory.sort(sortFunction).map((subCategory)=><option key={subCategory} value={subCategory}>{subCategory}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Server Type</Form.Label>
      <Form.Control name="serverType" as="select" onChange={handleInputChangeA} value={selectedA.serverType}>
          {selectedA.env&&options[selectedA.env][selectedA.subCategory].serverType.sort(sortFunction).map((serverType)=><option  key={serverType} value={serverType}>{serverType}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Host A</Form.Label>
      <Form.Control name="host" as="select" onChange={handleInputChangeA} value={selectedA.hostA}>
          {selectedA.env&&options[selectedA.env][selectedA.subCategory][selectedA.serverType].hostNames.map((hostName)=><option  key={hostName} value={hostName}>{hostName}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="validationFormik01">
      <Form.Label>Date</Form.Label>
      <Form.Control
        type="date"
        name="date"
        defaultValue={selectedA.date}
        onChange={handleInputChangeA}
      />
    </Form.Group>

  </Form.Row>
  <Form.Row>
    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Environment</Form.Label>
      <Form.Control name="env" as="select" onChange={handleInputChangeB} value={selectedB.env}>
          {options.env&&options.env.map((env)=><option key={env} value={env} onChange={handleInputChangeB}>{env}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Sub Category</Form.Label>
      <Form.Control name="subCategory" as="select" onChange={handleInputChangeB} value={selectedB.subCategory}>
          {selectedB.env&&options[selectedB.env].subCategory.map((subCategory)=><option key={subCategory} value={subCategory}>{subCategory}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Server Type</Form.Label>
      <Form.Control name="serverType" as="select" onChange={handleInputChangeB} value={selectedB.serverType}>
          {selectedB.env&&options[selectedB.env][selectedB.subCategory].serverType.map((serverType)=><option  key={serverType} value={serverType}>{serverType}</option>)}
      </Form.Control>
    </Form.Group>

    <Form.Group as={Col} controlId="formGridState">
      <Form.Label>Host B</Form.Label>
      <Form.Control name="host" as="select" onChange={handleInputChangeB} value={selectedB.host}>
          {selectedB.env&&options[selectedB.env][selectedB.subCategory][selectedB.serverType].hostNames.map((hostName)=><option  key={hostName} value={hostName}>{hostName}</option>)}
      </Form.Control>
    </Form.Group>


    <Form.Group as={Col} controlId="validationFormik01">
      <Form.Label>Date</Form.Label>
      <Form.Control
        type="date"
        name="date"
        defaultValue={selectedB.date}
        onChange={handleInputChangeB}
      />
    </Form.Group>
  </Form.Row>
  <Form.Row>
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
