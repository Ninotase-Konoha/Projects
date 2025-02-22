import { Button, Card, CardActions, CardContent, CardMedia, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'

// get description
const getShortDescription = (description) => {
  if (description) {
    if (description.length > 50) {
      return description.substring(0, 50) + "..."
    } else {
      return description
    }
  } else {
    return "No description available"
  }
}


export default function Bookcard({bookData}) {
  const {title, year, description, thumbnail, book_id, authors} = bookData

  // limit the description to 50 characters
  const shortDescription = getShortDescription(description);

  return (
    <Card
      sx={{
        width: 300,
        m: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <CardMedia
          sx={{
            width: 192,
            height: 305,
          }}
          image={`data:image/jpeg;base64,${thumbnail}`}
          title={`thumbnail for ${title}`}
        />
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Year: {year}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            mb: 1,
          }}
        >
          <Typography variant="body1" sx={{mr: 2}}>
            Written by:
          </Typography>
          {authors.map((author, idx) => {
            return (
              <Link
                key={`bookcard author ${idx}`}
                href={`/author/${author.author_id}`}
              >
                <Typography
                  variant="body1"
                  ml={1}
                  mr={1}
                >
                  {author.name}
                </Typography>
              </Link>
            )
          })}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          fontStyle={'italic'}
        >
          {shortDescription}
        </Typography>
      </CardContent>
      <CardActions>
        <Link
          sx={{
            textDecoration: 'none',
          }}
          href={`/book/${book_id}`}
        >
          <Button
            size="small"
            variant='outlined'
          >
            Learn More
          </Button>
        </Link>
      </CardActions>
    </Card>
  )
}
