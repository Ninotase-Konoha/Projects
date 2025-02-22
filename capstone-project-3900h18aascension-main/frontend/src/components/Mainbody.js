import { Box } from '@mui/system'
import React from 'react'

export default function Mainbody({children}) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 80,
        left: 0,
        width: '100%',
        height: 'calc(100vh - 120px)',
        backgroundColor: 'white',
        overflow: 'auto',
        pt: 5,
        pb: 10,
      }}
    >
      {children}
    </Box>
  )
}

