import { Avatar, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, {useState, useEffect, useContext} from 'react'
import { useParams } from 'react-router-dom';
import Collection from '../components/Collection';
import ReviewWithBook from '../components/ReviewWithBook';
import WaitingCircle from '../components/WaitingCircle';
import { AuthContext } from '../context';

// calculate how long a user has joined the website
const calculateJoinDate = (date) => {
  const today = new Date();
  const joinDate = new Date(date);
  const diff = today - joinDate;
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function Profile() {
  const { userId } = useParams();

  // there are 3 parts: user profile, user collection and user reviews.
  // so 3 loading states
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // they comes with data
  const [profile, setProfile] = useState({});
  const [collections, setCollections] = useState([]);
  const [reviews, setReviews] = useState([]);

  // get context to see if it is the current user
  const {contextIsLogin, contextUserId} = useContext(AuthContext);

  // fetch data
  useEffect(() => {
    const fetchProfile = async () => {
      const url = `http://localhost:5000/user/${userId}`;
      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        }
      }

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setProfile(data)
        setIsLoadingProfile(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCollections = async () => {
      const url = `http://localhost:5000/collection/user/${userId}`;
      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        }
      }

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setCollections(data)
        setIsLoadingCollections(false);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchReviews = async () => {
      const url = `http://localhost:5000/review/user/${userId}`;
      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        }
      }

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setReviews(data)
        setIsLoadingReviews(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchCollections();
    fetchReviews();
  }, []);

  return (
    isLoadingCollections || isLoadingProfile || isLoadingReviews ? (
      <WaitingCircle text={'Loading profiles ...'}/>
    ) : (
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={3}
        sx={{
          width: '90%',
          pt: 5,
          pb: 5,
          px: 15,
        }}
      >
        {/* profile: image and username, email, joined xxx days ago */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Avatar
            src={`data:image/jpeg;base64,${profile.avatar}`}
            sx={{
              width: 280,
              height: 280,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              pl: 10,
            }}
          >
            <Typography
              variant="h4"
              pb={2}
            >
              {contextUserId === userId ? (
                `My Username: ${profile.username}`
              ) : (`Username: ${profile.username}`
              )}
            </Typography>
            <Typography
              variant="h5"
              pb={2}
            >
              {contextUserId === userId ? (
                `My Email: ${profile.email}`
              ) : (
                `Email: ${profile.email}`
              )}
            </Typography>
            <Typography
              variant="h5"
              pb={2}
            >
              {contextUserId === userId ? (
                `I Joined: ${calculateJoinDate(profile.created_at)} days ago`
              ) : (
                `Joined: ${calculateJoinDate(profile.created_at)} days ago`
              )}
            </Typography>
          </Box>
        </Box>

        {/* user collection */}
        <Box
          sx={{
            pt: 5,
            pb: 5,
            width: '90%'
          }}
        >
          <Typography
            variant="h4"
          >
            {contextUserId === userId ? (
              `My Collections: total ${collections.length}`
            ) : (
              `Collections: total ${collections.length}`
            )}
          </Typography>
          {collections.map((c, idx) => (
            <Collection
              key={idx}
              collectionData={c}
            />
          ))}
        </Box>

        {/* user reviews */}
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={4}
        >
          <Typography
            variant="h4"
          >
            {contextUserId === userId ? (
              `My Reviews: total ${reviews.length}`
            ) : (
              `Reviews: total ${reviews.length}`
            )}
            {reviews.map((r, idx) => (
              <ReviewWithBook
                key={idx}
                reviewData={r}
              />
            ))}
          </Typography>
        </Stack>
      </Stack>
    )
  )
}
