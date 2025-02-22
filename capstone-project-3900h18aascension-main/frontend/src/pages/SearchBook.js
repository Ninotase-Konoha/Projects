import { Box, Checkbox, FormControlLabel, FormGroup, MenuItem, Pagination, Select, Slider, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Bookcard from '../components/Bookcard';
import WaitingCircle from '../components/WaitingCircle';

// top 30 book categories
const bookCategories = [
  "Fiction",
  "Juvenile Fiction",
  "Biography & Autobiography",
  "History",
  "Comics & Graphic Novels",
  "Novel",
  "Literary Criticism",
  "Philosophy",
  "Drama",
  "Religion",
  "Juvenile Nonfiction",
  "Business & Economics",
  "Poetry",
  "Literary Collections",
  "Science",
  "Social Science",
  "Psychology",
  "Body, Mind & Spirit",
  "Performing Arts",
  "Computers",
  "Political Science",
  "Art",
  "Humor",
  "Cooking",
  "Travel",
  "Self-Help",
  "Health & Fitness",
  "Family & Relationships",
  "Nature",
  "Language Arts & Disciplines",
];

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

function valuetext(value) {
  return `year ${value}`;
}

export default function SearchBook() {
  // books state
  const [books, setBooks] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(true);

  // keyword input state
  const [inputValue, setInputValue] = useState('');

  // year range, min distance = 1
  const minYearDistance = 1;

  // set initial year range
  const initialYearRange = [1590, 2023];
  const [yearRange, setYearRange] = useState(initialYearRange);

  // handle change
  const handleYearRangeChange = (event, newYearRange, activeThumb) => {
    if (!Array.isArray(newYearRange)) {
      return;
    }

    if (activeThumb === 0) {
      setYearRange([Math.min(newYearRange[0], yearRange[1] - minYearDistance), yearRange[1]]);
    } else {
      setYearRange([yearRange[0], Math.max(newYearRange[1], yearRange[0] + minYearDistance)]);
    }
  }

  // all categories
  const initialCategoryStates = bookCategories.map((category) => {
    return {"label": category, "checked": true};
  });

  const [categoryStates, setCategoryStates] = useState(initialCategoryStates);

  const handleChangeCategory = (event, idx) => {
    const newCategoryStates = [...categoryStates];
    newCategoryStates[idx].checked = event.target.checked;
    setCategoryStates(newCategoryStates);
  };

  // console.log(categoryStates);

  // options for sort
  const sortOptions = [
    "Year ascending",
    "Year descending",
    "Rating ascending",
    "Rating descending",
  ];

  const [sortOption, setSortOption] = useState(sortOptions[0]);

  // some results from the books
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);

  // use effect to fetch
  useEffect(() => {
    // prepare the params
    const params = {
      "keyword": inputValue.trim(),
      "from_year": yearRange[0],
      "to_year": yearRange[1],
      "category": categoryStates.filter((e) => e.checked).map((e) => e.label),
      "sort": sortOption.toLowerCase().includes("year") ? "year" : "rating",
      "order": sortOption.toLowerCase().includes("asc") ? "asc" : "desc",
      "item_on_page": 20,
      "page": pageIdx,
    };

    console.log(params);

    // async function to fetch data
    const fetchData = async () => {
      // before fetch set loading state on
      setIsLoading(true);

      // prepare url and options
      const url = "http://localhost:5000/book/search";
      const options = {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        }
      };

      // fetch
      try {
        const response = await fetch(url, options);
        console.log(response.status);
        const data = await response.json();
        console.log(data);

        // set the data to display
        setBooks(data.books);
        setTotalItems(data.total_items);
        setTotalPages(data.total_pages);

        // set loading state off
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [inputValue, yearRange, categoryStates, sortOption, pageIdx]);

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
      width="100%"
      pb={10}
    >
      {/* search box */}
      <HorizontalBox>
        <TextField
          label="Enter Book Keyword:"
          value={inputValue}
          size="large"
          onChange={(event) => {setInputValue(event.target.value)}}
          sx={{
            width: 600,
            fontSize: 20,
          }}
        />
      </HorizontalBox>

      {/* year from and year to */}
      <HorizontalBox>
          <Typography
            variant="h6"
            sx={{
              pr: 3,
            }}
          >
            Year Range (1590 - 2023):
          </Typography>
          <Slider
            disableSwap
            value={yearRange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            onChange={handleYearRangeChange}
            min={initialYearRange[0]}
            max={initialYearRange[1]}
          />
      </HorizontalBox>

      {/* category */}
      <HorizontalBox>
        <Typography
          variant="h6"
          sx={{ pr: 3}}
        >
          Category:
        </Typography>
        <FormGroup
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {categoryStates.map((categoryState, idx) => {
            return (
              <FormControlLabel
                key={idx}
                label={categoryState.label}
                control={
                  <Checkbox
                    checked={categoryState.checked}
                    onChange={(event) => {handleChangeCategory(event, idx)}}
                  />
                }
              />
            )
          })}
        </FormGroup>
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

      {/* result display section */}
      {isLoading ? (
        <WaitingCircle text='Searching in progress ...'/>
      ) : (
        <Box
          sx={{
            px: 5,
            py: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '90%',
          }}
        >
          <Typography
            variant="h6"
            color='success'
            pb={2}
          >
            {`Page: ${pageIdx + 1}: ${totalItems} books found on total ${totalPages} pages.`}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {books.map((bookData, idx) => {
              return (
                <Bookcard
                  key={idx}
                  bookData={bookData}
                />
              )
            })}
          </Box>
          {/* page index position */}
          <Pagination
            count={totalPages}
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
    </Stack>
  )
}



