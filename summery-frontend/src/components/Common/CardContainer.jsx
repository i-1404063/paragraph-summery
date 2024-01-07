import React, { useState, useCallback } from 'react'
import { Container, Grid } from '@mui/material'
import ParagraphCard from './Card'
import FetchParagraphComponent from './FetchParagraphComponent'

const CardContainer = () => {
  const [paragraphs, setParagraphs] = useState([]);  

  const onFetchedParagraphs = useCallback(paragraphs => {
       setParagraphs(paragraphs)
  },[])

  const handleNext = (id) => {
      const filtered = [...paragraphs.map(p => p.id === id ? {...p, cnt: p.cnt + 1} : p)]
      setParagraphs(filtered);
  }

  return (
      <>
           <FetchParagraphComponent FetchParagraphs={onFetchedParagraphs}/>
           <Container maxWidth="lg">
               <Grid container spacing={2}>
                    <ParagraphCard paragraphs={paragraphs} onNext={handleNext}/>
               </Grid>
           </Container>
      </>
  )
}

export default CardContainer;