import React, { useState } from 'react'
import { Box, Button, Paper, Grid, InputLabel, TextField, Typography, InputAdornment, IconButton} from "@mui/material";
import { green } from '@mui/material/colors'
import Visibility  from '@mui/icons-material/Visibility'
import { toast } from 'react-toastify';
import { validateInput } from '../../utils/inputValidation';
import api from '../../configs/Api';


const CreateUser = () => {
    const [visibility, setVisibility] = useState(false)
    const [passType, setPassType] = useState('password')
    const [user, setUser] = React.useState({
        firstname: "",
        email: "",
        password: "",
        role: "admin"
    })

    const onChange = ({ target: { name, value } }) => {
        setUser({...user, [name]: value})
    }

    const handleVisibility = () => {
       if(!visibility) {
          setPassType("text")
          setVisibility(true)
       } else {
          setPassType("password")
          setVisibility(false)
       }
    }

    const onSubmit = async (e) => {
      e.preventDefault();
      if(validateInput(user)) {
          try {
              const response = await api.post("signup", user);
              if(response.status == 200) {
                setUser({firstname: "", email: "", password: "", role: ""})
                const { data: { message }} = response;
                toast(message, {
                  autoClose: 2000
                })
              }
          } catch (err) {
              if(err.response) {
                 const { data: { message } } = err.response;
                 toast(`${message}`, {
                   autoClose: 2000
                 })
              } else {
                 toast('Something went wrong.Plz Try Again!', {
                   autoClose: 2000
                 })
              }
          }
      }else {
         toast("Invalid Input")
      }
    }

    return <React.Fragment>
        <Paper elevation={3} sx={{ marginRight: "25%", marginLeft: "25%", borderRadius: "25px" }}>
          <Typography sx={{textAlign: "center", mt: "15px", border: "2px solid green", borderRadius: "25px"}} variant='h4' color={green[700]}>Create Admin User</Typography>
          <form onSubmit={onSubmit}>
            <Box sx={{ padding: 3, marginTop: "20px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={2}>
                <InputLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: 700
                  }}
                >
                  Username
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  // required
                  id="firstname"
                  name="firstname"
                  label="username"
                  onChange={onChange}
                  value={user.firstname}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                />
              </Grid>
            
              <Grid item xs={12} sm={2}>
                <InputLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: 700
                  }}
                >
                  Email
                </InputLabel>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  // required
                  id="email"
                  name="email"
                  label="email"
                  onChange={onChange}
                  value={user.email}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                />
              </Grid>

              {/*  */}
              <Grid item xs={12} sm={2}>
                <InputLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: 700
                  }}
                >
                  Password
                </InputLabel>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  id="password"
                  InputProps={{
                    endAdornment:
                    <InputAdornment>
                       <IconButton edge="end" onClick={handleVisibility}>
                         <Visibility/> 
                       </IconButton>
                    </InputAdornment>
                  }}
                  name="password"
                  type={passType}
                  label="password"
                  onChange={onChange}
                  value={user.password}
                  fullWidth
                  size="small"
                  autoComplete="off"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={2}></Grid>
              <Grid item xs={12} sm={4}>
                <Button type="submit" variant="contained" color='success'>Submit</Button>
              </Grid> 
             </Grid>  
           </Box>
          </form>
      </Paper>
                
    </React.Fragment>
             
       
}

export default CreateUser