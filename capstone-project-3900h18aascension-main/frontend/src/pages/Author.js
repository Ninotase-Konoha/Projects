import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Bookcard from '../components/Bookcard';
import WaitingCircle from '../components/WaitingCircle';

const calculateAge = (date) => {
  const today = new Date();
  const joinDate = new Date(date);
  const diff = today - joinDate;
  const diffYears = Math.ceil(diff / (1000 * 60 * 60 * 24) / 365);
  return diffYears;
};

export default function Author() {
  const {authorId} = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [books, setBooks] = useState([]);

  console.log(profile);
  console.log(books);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:5000/author/${authorId}`;
      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        setProfile(data.author);
        setBooks(data.books);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    isLoading ? (
      <WaitingCircle text={'Searching author ...'}/>
    ) : (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          pb: 5,
        }}
      >
        {/* photo, name, birth year in the middle */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            pb: 2,
          }}
        >
          <Box
            component="img"
            src={`data:image/jpeg;base64,${profile.photo}`}
            sx={{
              width: 600,
              borderRadius: 5,
              mb: 5
            }}
          />
          <Typography
            variant="h5"
            pb={2}
          >
            {`Author: ${profile.name}`}
          </Typography>
          <Typography
            variant="h5"
            pb={2}
          >
            {`Born ${profile.birthyear} - ${calculateAge(profile.birthyear)} years old`}
          </Typography>
        </Box>

        {/* all books */}
        <Box
          sx={{
            width: '90%',
            px: 15,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              py: 2,
              px: 3,
            }}
          >
            {`Books: total ${books.length} ${books.length > 1 ? 'books' : 'book'}`}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {books.map((b, idx) => (
              <Bookcard
                key={idx}
                bookData={b}
              />
            ))}
          </Box>
        </Box>
      </Box>
    )
  )
}
