import { Button, Link, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'
import BookImage from '../assets/book.jpg';
import WaitingCircle from '../components/WaitingCircle';
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    isLoading ? (
      <WaitingCircle text={'Loading ...'}/>
    ) : (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            backgroundImage: `url(${BookImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '95%',
            height: 700,
            backgroundPosition: 'center',
            opacity: 0.10,
            borderRadius: 4,
            position: 'fixed',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pt: 20,
          }}
        >
          <Typography
            fontSize={50}
            fontWeight={800}
            color='#808080'
            sx={{
              textShadow: '1px 1px #000000',
            }}
          >
            Welcome to Book Finder Website
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              pt: 15,
            }}
          >
            <Button
              variant='contained'
              size='large'
              color='primary'
              startIcon={<SearchIcon />}
              component={Link}
              href="/search/book"
              sx={{
                width: 250,
                height: 50,
              }}
            >
              <Typography>
                Search by Book
              </Typography>
            </Button>

            <Button
              variant='contained'
              size='large'
              color='primary'
              startIcon={<SearchIcon />}
              component={Link}
              href="/search/author"
              sx={{
                width: 250,
                height: 50,
              }}
            >
              Search by Author
            </Button>
          </Box>
        </Box>
      </Box>
    )
  )
}
