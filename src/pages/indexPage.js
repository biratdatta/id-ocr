'use client';

import React from 'react';
import { Container, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DataValidation from './DataValidation';
import DataExtraction from './DataExtraction';
 import Transcription from './Transcription';
import './styles.css';

export default function IndexPage() {
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    if (!isExpanded) {
      // Reset the state when accordion is closed
    }
  };

  return (
    <Container className="container">
      <Accordion onChange={handleAccordionChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Document Type Validation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataValidation />
        </AccordionDetails>
      </Accordion>

      <Accordion onChange={handleAccordionChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Data Extraction</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataExtraction />
        </AccordionDetails>
      </Accordion>

      <Accordion onChange={handleAccordionChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Transcription</Typography>
        </AccordionSummary>
        <AccordionDetails>
       <Transcription />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
