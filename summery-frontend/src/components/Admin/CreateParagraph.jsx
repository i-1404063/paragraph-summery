import React, { useState } from 'react'
import { Box, Button, Paper, Grid, InputLabel, TextField, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { green } from '@mui/material/colors'
import { toast } from 'react-toastify';
import { validateInput } from '../../utils/inputValidation';
import api from '../../configs/Api';

const CreateParagraph = () => { 
  const [input, setInput] = useState({
      lang: "Bangla",
      title: "",
      description: ""
  });

  const onChange = ({target: { name, value }}) => {
      setInput({...input, [name]: value })
  }

  const onSubmit = async (e) => {
      e.preventDefault()
      if(validateInput(input)) {
          try {
            const response = await api.post("create-paragraph", input)
            if(response.status == 200) {
                setInput({title: "", description: "", lang: "Bangla"})
                const { data: { message } } = response;
                toast(`${message}`, {autoClose: 2000})
            }
          } catch (err) {
                if(err.response) {
                    const { data:{ message } } = err.response;
                    toast(message, { autoClose: 2000 })
                } else {
                    toast("Something went wrong. Try again!", {autoClose: 3000})
                }
          }
      } else {
        toast("Invalid input.")
      } 
  }  

  return (
      <React.Fragment>
        <Paper elevation={3} sx={{ mt: "15px", marginRight: "25%", marginLeft: "25%", borderRadius: "25px" }}>
          <Typography sx={{textAlign: "left", display: "inline-block", padding: "3px 7px" , border: "2px solid green", borderRadius: "25px"}} variant='h4' color={green[700]}>Create Article</Typography>
          <form onSubmit={onSubmit}>
             <FormControl sx={{ mt: 3, ml: 3, minWidth: 180 }} color='secondary' focused>
              <InputLabel id="type">Select Language</InputLabel>
              <Select
                labelId="lang"
                id="lang"
                name='lang'
                value={input.lang}
                label="Select Language"
                onChange={onChange}
                // renderValue={(value) => `⚠️ - ${value[0].toUpperCase() + value.slice(1)}`}
              >
          
                <MenuItem value="Bangla">Bangla</MenuItem>
                <MenuItem value="English">English</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ padding: 3, marginTop: "10px" }}>
              <Grid item xs={12} sm={4} sx={{marginBottom: "10px"}}>
                  <TextField
                    id="title"
                    name="title"
                    value={input.title}
                    onChange={onChange}
                    type="text"
                    label={input.lang === "Bangla" ? "শিরোনাম" : "Title"}
                    fullWidth
                    size='small'
                    autoComplete='off'
                    variant='outlined'
                  />
              </Grid>   
              <Grid item xs={12} sm={4}>
                <TextField
                  multiline={true}
                  rows={10}
                  id="description"
                  name="description"
                  value={input.description}
                  onChange={onChange}
                  label={input.lang === "Bangla" ? "অনুচ্ছেদ" : "Article"}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                />
              </Grid>
              <Grid sx={{ display: "flex", justifyContent: "flex-end", mt: "5px" }} item xs={12} sm={4}>
                <Button type="submit" variant="contained" color='success'>Submit</Button>
              </Grid>
             </Box>
          </form>
      </Paper>
                
    </React.Fragment>
  )
}

export default CreateParagraph