import { Box, Stack } from '@mui/system'
import React from 'react'
import Bookcard from './Bookcard'
import Review from './Review'

export default function ReviewWithBook({ reviewData }) {

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={4}
      pt={2}
      pb={2}
    >
      <Bookcard
        bookData={reviewData.book}
      />
      <Review
        reviewData={reviewData.review}
        userData={reviewData.user}
      />
    </Stack>
  )
}
