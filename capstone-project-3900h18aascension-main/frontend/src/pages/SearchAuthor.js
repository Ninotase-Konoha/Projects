import { Autocomplete, MenuItem, TextField, Typography, Select, Pagination } from '@mui/material';
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Authorcard from '../components/Authorcard';
import WaitingCircle from '../components/WaitingCircle';

function HorizontalBox({children}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        flexShrink: 1,
        width: '82%',
        pt:1,
        pb: 1,
      }}
    >
      {children}
    </Box>
  );
}

export default function SearchAuthor() {
  // keyword input
  const [inputValue, setInputValue] = useState('');
  const [authorNames, setAuthorNames] = useState([]);

  // sort options
  const sortOptions = [
    "Name ascending",
    "Name descending",
    "Birth year ascending",
    "Birth year descending",
  ];

  const [sortOption, setSortOption] = React.useState(sortOptions[0]);

  // fetch the author names
  useEffect(() => {
    const fetchAuthorNames = async () => {
      const url = 'http://127.0.0.1:5000/author/all_names';
      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        }
      };

      try {
        const respnse = await fetch(url, options);
        const data = await respnse.json();
        setAuthorNames(data.names);
        localStorage.setItem("authorNames", JSON.stringify(data.names));
      } catch (error) {
        console.log(error);
      }
    }

    // see if the authors are saved in local storage,
    // if not, then fetch
    if (localStorage.getItem("authorNames")) {
      setAuthorNames(JSON.parse(localStorage.getItem("authorNames")));
    } else {
      fetchAuthorNames();
    }
  }, []);

  // check loading
  const [isLoading, setIsLoading] = useState(true);
  const [pageIdx, setPageIdx] = useState(0);
  const [authorData, setAuthorData] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const fetchAuthors = async () => {
      // turn on loading state
      setIsLoading(true);

      const params = {
        keyword: inputValue.trim(),
        page: pageIdx,
        sort: sortOption.toLowerCase().includes("name") ? "name" : "birthyear",
        order: sortOption.toLowerCase().includes("asc") ? "asc" : "desc",
        item_on_page: 20,
      };

      const url = 'http://127.0.0.1:5000/author/search';
      const method = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },

        body: JSON.stringify(params),
      };

      try {
        const response = await fetch(url, method);
        const data = await response.json();

        setAuthorData(data.authors);
        setTotalItem(data.total_item);
        setTotalPage(data.total_page);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAuthors();
  }, [inputValue, sortOption, pageIdx]);

  return (
    <Box
      width='100%'
      pb={10}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 2,
          width: '90%',
          py: 10,
        }}
      >
        {/* name keyword */}
        <HorizontalBox>
          <Autocomplete
            inputValue={inputValue}
            clearOnBlur={false}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            options={authorNames}
            renderInput={(params) => <TextField {...params} label="Enter Author Name:" />}
            sx={{
              width: 550,
              fontSize: 20,
            }}
          />
        </HorizontalBox>

        {/* sort */}
        <HorizontalBox>
          <Typography
            variant="h6"
            sx={{ pr: 3}}
          >
            Sort by:
          </Typography>
          <Select
            onChange={(event) => {setSortOption(event.target.value)}}
            sx={{ minWidth: 250 }}
            value={sortOption}
          >
            {sortOptions.map((option, idx) => {
              return (
                <MenuItem
                  value={option}
                  key={idx}
                >
                  {option}
                </MenuItem>
              )
            })}
          </Select>
        </HorizontalBox>
      </Box>
      {isLoading ? (
        <WaitingCircle text="Searching authors ..."/>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            px: 5,
            gap: 5,
            width: '90%',
          }}
        >
          <Typography
            variant="h5"
            pb={2}
          >
            {`Page: ${pageIdx + 1}: Total ${totalItem} authors found in ${totalPage} pages.`}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {authorData.map((author, idx) => (
              <Authorcard
                key={`author-${idx}`}
                authorData={author}
              />
            ))}
          </Box>

          {/* page index position */}
          <Pagination
            count={totalPage}
            page={pageIdx+1}
            onChange={(event, value) => {setPageIdx(value - 1)}}
            boundaryCount={2}
            siblingCount={1}
            size="large"
            sx={{
              pt: 5,
              pb: 2,
            }}
          />
        </Box>
      )}
    </Box>
  )
}
