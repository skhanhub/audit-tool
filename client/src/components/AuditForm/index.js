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
    {/* <Form.Group as={Col} controlId="formGridCity">
      <Form.Label>City</Form.Label>
      <Form.Control />
    </Form.Group> */}

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

    <Form.Group as={Col} md="4" controlId="validationFormik01">
      <Form.Label>Date</Form.Label>
      <Form.Control
        type="date"
        name="date"
        defaultValue={selected.date}
        // value={values.firstName}
        onChange={handleInputChange}
        // isValid={touched.firstName && !errors.firstName}
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
  <Form.Row>
    <Form.Group as={Col} controlId="formGridZip">
    <Form.Label>Servers</Form.Label>
    {selected.env&&<Multiselect
      options={options[selected.env][selected.subCategory][selected.serverType].hostNames} // Options to display in the dropdown
      isObject={false}
      showCheckbox={true}
      selectedValues={[...selected.hostName]}
      onSelect={onSelect} // Function will trigger on select event
      onRemove={onSelect} // Function will trigger on remove event
      displayValue="name" // Property name to display in the dropdown options
      avoidHighlightFirstOption
      style={ {"multiselectContainer": { "height": "2rem", zIndex: 999 }} }
    />}
    </Form.Group>
  </Form.Row>
  </>
  );
}
