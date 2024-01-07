import React from 'react'
import { green } from '@mui/material/colors'

const rootClass = {
    margin: "auto 0px",
    padding: "3px 10px",
    border: `2px solid ${green[700]}`,
    "border-radius": "5px"
}

const ParagraphNotFound = () => {
  
  return (
     <section style={{...rootClass}}>
          <h3>OOPs! No Paragraph Found.</h3>
     </section>
  )
}

export default ParagraphNotFound;