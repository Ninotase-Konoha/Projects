import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import Bookcard from './Bookcard';

export default function Collection({ collectionData }) {
  const { books, created_at, description, title } = collectionData;

  // console.log(books[0].book);

  return (
    <Accordion
      sx={{
        width: '100%',
        mt: 3,
        mb: 3,
        p: 3,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography
          variant="h5"
        >
          {`Collection ${title} created at ${created_at} (${books.length} ${books.length > 1 ? 'books' : 'book'})`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          variant="h5"
          fontStyle={'italic'}
        >
          {`Description: ${description}`}
        </Typography>

        {/* create the timeline with small book info */}
        <Timeline>
          {books?.map((b, idx) => (
            <TimelineItem
              key={`${idx}, ${b.book.title}`}
            >
              <TimelineOppositeContent>
                <Typography
                  variant="h6"
                >
                  {`Added at ${b.collection_book.added_at}`}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot/>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                  <Bookcard bookData={b.book}/>
              </TimelineContent>
            </TimelineItem>
          ))}

          {/* the last timeline item has no connector */}
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot/>
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6">
                {`Created at ${created_at}`}
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </AccordionDetails>
    </Accordion>
  )
}
