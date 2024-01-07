import React from 'react'
import { Box, Typography } from '@mui/material'
import { purple } from '@mui/material/colors'

const AdminComponent = () => {

  return (
    <Box sx={{mt: "-50px", textAlign: 'center'}}>
         <Typography variant='h4' sx={{fontWeight: 700}} color={purple[700]}>
              Welcome to Admin Dashboard 
         </Typography>
    </Box>
  )
}

export default AdminComponent