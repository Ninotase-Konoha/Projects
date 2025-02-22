import { Avatar, Link, Typography } from '@mui/material';
import { Box } from '@mui/system'
import React from 'react'

export default function Review({ reviewData, userData }) {
  const { review_id, book_id, rating, review, created_at, last_edited_at } = reviewData
  const { username, avatar, user_id } = userData;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        mt: 2,
        mb: 6,
        maxWidth: 850,
      }}
    >
      <Avatar
        alt={`Avatar for ${username}`}
        src={`data:image/jpeg;base64,${avatar}`}
        sx={{
          width: 140,
          height: 140,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          ml: 6,
        }}
      >
        <Link
          href={`/profile/${user_id}`}
        >
          <Typography
            variant="h5"
          >
            {`Reader: ${username}`}
          </Typography>
        </Link>
        <Typography
          variant="h5"
          gutterBottom
        >
          {`Rating: ${rating}`}
        </Typography>
        <Typography
          variant="h5"
          fontStyle='italic'
          gutterBottom
        >
          {review}
        </Typography>
        <Typography
          variant="body1"
        >
          {`Created at: ${created_at}`}
        </Typography>
        <Typography
          variant="body1"
        >
          {`Last updated at: ${last_edited_at}`}
        </Typography>
      </Box>
    </Box>
  )
}
