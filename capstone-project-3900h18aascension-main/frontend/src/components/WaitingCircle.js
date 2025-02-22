import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

export default function WaitingCircle({ text }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
      }}
    >
      <CircularProgress size={60}/>
      <Typography
        variant="h6"
        mt={5}
      >
        {text}
      </Typography>
    </Box>
  )
}
