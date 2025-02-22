import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Avatar, AvatarGroup, Box, CircularProgress, Link, Stack, Tooltip, Typography } from '@mui/material'
import { Container } from '@mui/system';
import Review from '../components/Review';
import WaitingCircle from '../components/WaitingCircle';

export default function Book() {
  const {bookId} = useParams();

  // set loading
  const [isLoading, setIsLoading] = useState(true);

  // book data: book, collection, finish, reviews
  const [book, setBook] = useState({});
  const [collection, setCollection] = useState([]);
  const [finishPeople, setFinishPeople] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  // fetch book data
  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:5000/book/${bookId}`;
      const options = {
        method: "GET",
        headers: {
          'accept': 'application/json',
        }
      };

      try {
        const response = await fetch(url, options);
        if (response.ok) {
          // convert to json and set the data
          const data = await response.json();
          setBook(data.book);
          setAuthors(data.authors);
          setCategories(data.categories);
          setCollection(data.collection);
          setFinishPeople(data.finish);
          setReviews(data.reviews);
          setRating(data.rating);

          // remove the loading state
          setIsLoading(false);
        } else {
          console.log(response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    isLoading ? (
      <WaitingCircle text='Searching the book ...'/>
    ) : (

      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={4}
        sx={{
          width: '80%',
          px: 15,
          py: 5,
        }}
      >
        {/* book info with image */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <Box
            component="img"
            src={`data:image/jpeg;base64,${book.thumbnail}`}
            sx={{
              width: 256,
              height: 390,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              flexGrow: 1,
              pl: 10,
            }}
          >
            <Typography variant="h3" gutterBottom>
              {book.title}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Rating: {rating}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Year: {book.year}
            </Typography>
            <Typography variant="h4" gutterBottom>
              ISBN: {book.isbn}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Total pages: {book.pageCount}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Publisher: {book.publisher}
            </Typography>
            <Typography variant="h4" gutterBottom>
              Description: {book.description}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                py: 2,
              }}
            >
              <Typography variant="h4" gutterBottom pr={2}>
                {authors.length > 1 ? 'Authors: ' : 'Author: '}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 5,
                }}
              >
                {authors.map((author, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      alt={author.name}
                      component="img"
                      src={`data:image/jpeg;base64,${author.photo}`}
                      sx={{
                        width: 180,
                        borderRadius: '5%',
                      }}
                    />
                    <Link
                      href={`/author/${author.author_id}`}
                    >
                      <Typography align='center' variant="h5">
                        {author.name}
                      </Typography>
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* show how many people have saved it into collection */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
          >
            {`Saved by ${collection.length} ${collection.length > 1 ? 'people' : 'person'}`}
          </Typography>
          <AvatarGroup
            total={5}
            sx={{
              flexGrow: 1,
              pl: 5,
            }}
          >
            {collection.map((e, idx) => (
              <Link
                key={idx}
                href={`/profile/${e.user_id}`}
                mr={2}
              >
                <Avatar
                  alt={`avatar of ${e.name}`}
                  src={`data:image/jpeg;base64,${e.avatar}`}
                  sx={{
                    width: 80,
                    height: 80,
                  }}
                />
              </Link>
            ))}
          </AvatarGroup>
        </Box>

        {/* show how many people have finished it */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
          >
            {`Finish reading by ${finishPeople.length} ${finishPeople.length > 1 ? 'people' : 'person'}`}
          </Typography>
          <AvatarGroup
            sx={{
              flexGrow: 1,
              pl: 5,
            }}
          >
            {finishPeople.map((e, idx) => (
              <Link
                href={`/profile/${e.user_id}`}
                mr={2}
              >
                <Avatar
                  alt={`avatar of ${e.name}`}
                  src={`data:image/jpeg;base64,${e.avatar}`}
                  sx={{
                    width: 80,
                    height: 80,
                  }}
                />
              </Link>
            ))}
          </AvatarGroup>
        </Box>


        {/* show all the reviews */}
        <Typography variant="h4" gutterBottom>
          {`Reviews: total ${reviews.length} reviews`}
        </Typography>
        <Box>
          {reviews.map((e, idx) => (
            <Review
              key={idx}
              reviewData={e.review}
              userData={e.user}
            />
          ))}
        </Box>
      </Stack>
    )
  );
}
