import React, { useEffect, useState } from 'react'
import { Container, Grid, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Card, CardContent } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../../configs/Api';
import { validateInput } from '../../utils/inputValidation';
import { green } from '@mui/material/colors';

const SummeryView = () => {
  const [users, setUsers] = useState([]);
  const [paragraphs, setParagraphs] = useState([]);
  const [summeries, setSummeries] = useState([]); 
  const [input, setInput] = useState({
      type: "",
      id: "",
      se_item: ""
  });

  useEffect(() => {
     const fetch = async () => {
         const id = toast.loading("Data loading...")
         try {
            const response = await api.get('get-userparagraph')
            if(response.status == 200) {
               const { data: { res } } = response;
               setUsers(res.users);
               setParagraphs(res.paragraphs);
               toast.update(id, { render: "Successfully loaded data", isLoading: false, type: "success", autoClose: 2000 })
            }
         } catch (err) {
            if(err.response) {
               const { data: { message } } = err.response;
               toast.update(id, { render: message, isLoading: false, type: "error", autoClose: 200 })
            }
         }
     }

     fetch();
  },[])

  const onChange = ({target: { name, value }}) => {
      if(name == "type") {
        setInput({ type: value, id: "", se_item: ""})
      }else {
        setInput({...input, [name]: value})
      }
  }

  const getUrl = (i) => {
      let url = `get-summery?type=${input.type}&id=${input.id}`;
      if(i['se_item'] !== "") {
         return `${url}&item=${i.se_item}`
      } else {
         return `${url}&item=all`
      }
  }

  const onSubmit = async (e) => {
      e.preventDefault();
      const {["se_item"]: removedkey, ...reqInput} = input
      if(validateInput(reqInput)) {
          const url = getUrl(input);
          const id = toast.loading("Summery loading...")
          try {
              const response = await api.get(url);
              if(response.status === 200) {
                 const { data } = response;
                 console.log("data===", response)
                 setSummeries(data);
                 toast.update(id, { render: "Successfully loaded data", isLoading: false, type: "success", autoClose: 2000 })
              }
          } catch (err) {
              if(err.response) {
                 const { data: { message } } = err.response;
                 toast.update(id, { render: message, isLoading: false, type: "error", autoClose: 3000 })
              }
          }
      }else {
        toast("Invalid Input")
      }
  }


  return (
     <Container maxWidth="lg" sx={{mt: 3}}>
         <Typography sx={{marginLeft: "30px", fontWeight: 700}} variant='h4' color='green'>Summery Search</Typography>
         <Box
           component="form"
           onSubmit={onSubmit}
           sx={{
              '& > :not(style)': { m: 1, width: '35ch' },
              border: "1px solid #E7EBF0",
              mt: 0,
              padding: "20px 40px",
              borderRadius: "30px"
            }}
           noValidate
           autoComplete="off"
        >
          <FormControl sx={{ m: 1, minWidth: 120 }} color='secondary' focused>
            <InputLabel id="type">Select Type</InputLabel>
            <Select
              labelId="type"
              id="type"
              name='type'
              value={input.type}
              label="Select Type"
              onChange={onChange}
              // renderValue={(value) => `⚠️ - ${value[0].toUpperCase() + value.slice(1)}`}
            >
        
              <MenuItem value="User">User</MenuItem>
              <MenuItem value="Paragraph">Paragraph</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} variant='filled' color='success' focused>
            <InputLabel id="id">Select {input?.type !== "" && input.type}</InputLabel>
            <Select
              labelId="id"
              id="id"
              value={input.id}
              name="id"
              onChange={onChange}
              // renderValue={(value) => `⚠️  - ${value}`}
            >
              {input.type == "" && <MenuItem value="">Select Type First</MenuItem>}
              {(users.length > 0 && input.type ==='User') && users.map(u => <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>)  }
              {(paragraphs.length > 0 && input.type ==='Paragraph') && paragraphs.map(p => <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>)  }
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} variant='filled' color='warning' focused>
            <Typography sx={{mt: "-25px"}}>optional</Typography>
            <InputLabel id="se_item">Select {input.type === "User" ? "Paragraph" : input.type == "" ? "" : "User"}</InputLabel>
            <Select
              labelId="se_item"
              id="se_item"
              name='se_item'
              value={input.se_item}
              onChange={onChange}
              // renderValue={(value) => `⚠️  - ${value[0].toUpperCase() + value.slice(1)}`}
            >
              {input.id == "" && <MenuItem value="">Select {input.type} First</MenuItem>}
              {(input.type == 'Paragraph' && input.id !== "") && users.map(u => <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>)  }
              {(input.type =='User' && input.id !== "") && paragraphs.map(p => <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>)  } 
            </Select>
          </FormControl>
          <Button size='small' type='submit' variant='contained' color="secondary">Search</Button>
      </Box>
      {
        summeries.length > 0 && <Box sx={{
              border: "1px solid #E7EBF0",
              mt: 5,
              padding: "20px 40px",
              borderRadius: "30px"
        }}>
              <Typography sx={{ fontWeight:800, mb: 4, border: "2px solid #ccc", padding: "5px 10px", borderRadius: "30px", display: "inline-block", fontSize: "30px", textAlign: "center" }} color={green[800]}>{input.type === "Paragraph" ? "Paragraph Wise Summery" : "User Wise Summery"}</Typography>
              <Grid container spacing={2}>
                  { summeries.map((sm, ind) => 
                  <Grid key={ind} item xs={12} sm={6} lg={4}>
                    <Paper elevation={3}>
                        <Card>
                            <CardContent>
                               <Typography variant='h6' color="WindowFrame">{sm.title}{sm?.username && <span style={{position: "relative",
                                  top:"-22px",right: "-86px", border: "2px solid whitesmoke", fontSize: "16px", padding: "2px 5px", borderRadius: "14px"}}>{sm.username}</span>}</Typography>
                               <Typography variant='body2' sx={{color: "#ccc", fontSize: "18px", textAlign: "justify"}}>{sm.sm_description}</Typography>
                            </CardContent>
                        </Card>
                    </Paper>
                  </Grid>) }
              </Grid>
       </Box>
      }
     </Container>
  )
}

export default SummeryView;