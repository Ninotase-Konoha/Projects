import { BottomNavigation, Typography } from '@mui/material'
import React from 'react'

export default function Footbar() {
  return (
    <BottomNavigation
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100%',
        left: 0,
        color: 'black',
        height: 40,
      }}
    >
      <p
      >
        © 2023 Book Finder by 3900 Ascension Group
      </p>
    </BottomNavigation>
  )
}
