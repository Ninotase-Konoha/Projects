import { Button, Card, CardActions, CardContent, CardMedia, Link, Typography } from '@mui/material';
import React from 'react'

export default function Authorcard({ authorData }) {
  console.log(authorData);

  const {author_id, name, birthyear, photo} = authorData;


  return (
    <Card
      sx={{
        width: 300,
        height: 'auto',
        mx: 2,
        my: 3,
      }}
    >
      <CardMedia
        sx={{
          height: 250,
        }}
        image={`data:image/jpeg;base64,${photo}`}
        title={`photo of ${name}`}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
        >
          {name}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
        >
          Birth year: {birthyear}
        </Typography>
      </CardContent>
      <CardActions>
        <Link
          sx={{
            textDecoration: 'none',
          }}
          href={`/author/${author_id}`}
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
