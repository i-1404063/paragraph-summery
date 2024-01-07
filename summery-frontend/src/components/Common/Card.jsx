import React, { useEffect, useState } from 'react';
import { purple, green } from "@mui/material/colors"
import { toast } from 'react-toastify';
import { Grid, Box, CardContent, Button, Typography, Paper, TextField } from '@mui/material';
import { validateInput } from '../../utils/inputValidation';
import api from '../../configs/Api';
import ParagraphNotFound from './ParagraphNotFound';


const ParagraphCard = ({ paragraphs, onNext }) => {
  const [crPrgraph, setCrPrgraph] = useState(null);
  const [disable, setDisable] = useState(true)
  const [input, setInput] = useState({
     paragraph_id: "",
     prsummery: ""
  });

  useEffect(() => {  
    if(paragraphs.length > 0 && !crPrgraph) {
        setDisable(true);
        const randomItem = selectRandom(paragraphs);
        setCrPrgraph(randomItem);
        if(randomItem) {
          setInput({...input, paragraph_id: randomItem.id})
        }
    }
  },[paragraphs, crPrgraph])

  const selectRandom = (paragraphs) => {
      const filteredParagraphs = paragraphs.filter(p => p.cnt < 2);
      if(filteredParagraphs.length === 0) return null;

      const index = Math.floor(Math.random() * filteredParagraphs.length);
      return filteredParagraphs[index];
  } 

  const handleNext = (id) => {
     setCrPrgraph(null);
     onNext(id);
  }

  const onSubmit = async (e) => {
      e.preventDefault();
      if(validateInput(input)) {
        try {
           const response = await api.post("summery-submit", input);
           if(response.status === 200) {
              const { message } = response.data;
              setInput({paragraph_id: "", prsummery: ""})
              setDisable(false);
              toast(message, { autoClose: 2000 })
           }
        } catch (err) {
          if(err.response) {
             const { data: { message } } = err.response;
             toast(message)
          }
        }  
      } else {
        toast("Invalid Input")
      }
  }

  if(!crPrgraph) return <ParagraphNotFound/>;

  return (
        <Grid item xs={12} sx={{display: "flex"}}>

          <Paper elevation={3} sx={{width: "450px", height: "600px", border: "2px solid green", borderRadius: "10px"}}>   
            <CardContent>
              <Typography variant='h5' sx={{ fontSize: 28, mb: 1, textAlign: "justify" }} color={green[700]} gutterBottom>
                  {crPrgraph.title}
              </Typography>
              <br/>
              <Typography variant='body2' sx={{fontSize: 20}}>
                { crPrgraph.description }
              </Typography>
            </CardContent>
          </Paper>
          
          <Paper elevation={3} sx={{ mt: "60px", marginRight: "10%", marginLeft: "10%", borderRadius: "25px" }}>
              <Grid sx={{ display: "flex", justifyContent: "flex-start", position:"relative", top: "-50px" }} item xs={12} sm={4}>
                    <Button onClick={() => handleNext(crPrgraph.id)}  disabled={disable} type="submit" variant="contained" color='success'>Next</Button>
              </Grid> 
              <Typography sx={{textAlign: "left", position:"relative", top:"-36px", display: "inline-block", padding: "3px 7px" , border: "2px solid green", borderRadius: "25px"}} variant='h4' color={purple[900]}>Summery Submission</Typography>
              <form onSubmit={onSubmit}>
                <Box sx={{ padding: 3, marginTop: "-10px" }}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      multiline={true}
                      rows={15}
                      placeholder='Write your summery'
                      id="prsummery"
                      name="prsummery"
                      value={input.prsummery}
                      onChange={({target: { name, value}}) => setInput({...input, [name]: value})}
                      label="Summery"
                      fullWidth
                      autoComplete="off"
                      variant="outlined"
                    />
                  </Grid>    
                    <Button sx={{ position: "relative", top: "8px", right: "-220px", widht: "103px"}} type="submit" variant="contained" color='success'>Submit</Button> 
                </Box>
              </form>
            </Paper>
        </Grid>
  );
}

export default ParagraphCard;