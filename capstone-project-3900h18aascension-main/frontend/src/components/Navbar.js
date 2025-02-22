import { AppBar, Avatar, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { useContext } from 'react'
import Logo from '../assets/logo192.png'
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../context';

export default function Navbar() {
  // get context
  const {
    contextIsLogin,
    contextAvatar,
    contextUserId,
    contextUsername,
    contextSetIsLogout,
  } = useContext(AuthContext);

  console.log(`navbar: ${contextIsLogin}`);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#f5f5f5',
        p: 1,
        height: 80,
      }}
    >
      <Container
        maxWidth="90%"
        sx={{
          pl: 8,
          pr: 8,
        }}
      >
        <Toolbar disableGutters>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 5,
              flexGrow: 1,
              pl: 2,
            }}
          >
            <Avatar
              src={Logo}
              alt="logo"
              sx={{
                width: 65,
                height: 65,
              }}
              component={Link}
              href="/"
            />
            <Typography
              variant="h4"
              noWrap
              sx={{
                color: '#000',
              }}
              component={Link}
              href="/"
              underline="none"
            >
              Book Finder
            </Typography>

            <Button
              size='large'
              color='primary'
              startIcon={<SearchIcon />}
              component={Link}
              href="/search/book"
            >
              <Typography>
                Book
              </Typography>
            </Button>

            <Button
              size='large'
              color='primary'
              startIcon={<SearchIcon />}
              component={Link}
              href="/search/author"
            >
              Author
            </Button>
          </Box>


          {/* navbar right side */}
          <Box
            sx={{
              display: 'flex',
              flexdirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 5,
            }}
          >
            {/* display signup+login, or avatar+logout */}
            {contextIsLogin ? (
              <>
                <Typography
                  variant="h5"
                  noWrap
                  sx={{
                    color: '#000',
                  }}
                >
                  Welcome back, {contextUsername}
                </Typography>
                <Avatar
                  alt={`${contextUsername} avatar`}
                  src={`data:image/png;base64,${contextAvatar}`}
                  sx={{
                    width: 65,
                    height: 65,
                  }}
                  component={Link}
                  href={`/profile/${contextUserId}`}
                />
                <Button
                  variant='contained'
                  size='large'
                  color='secondary'
                  onClick={contextSetIsLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
              <Button
                variant='contained'
                size='large'
                color='primary'
                component={Link}
                href="/signup"
              >
                Sign Up
              </Button>
              <Button
                variant='contained'
                size='large'
                color='secondary'
                component={Link}
                href="/login"
              >
                Login
              </Button>
            </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
