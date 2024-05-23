'use client'

 import React, { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import SearchIcon from '@mui/icons-material/Search';
import "./styles.css"

const options = [
  { label: 'Pan Card', value: 'permanent account number' },
  { label: 'Cheque Return Memo', value: 'cheque' },
];

const exampleTexts = {
  'permanent account number': 'Permanent Account Number, Income Tax Department',
  cheque: 'return memo',
};

export default function IndexPage() {

  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [showData, setShowData] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [inputValues, setInputValues] = useState(options[0].value);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    setInputValues(selectedOption);
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setInputValues(event.target.value);
  };

  const handleInputChange = (event) => {
    setInputValues(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(file);
      setImageUrl(url);
      setShowData(false);
      setJsonData(null);
    }
  };

  const handleSubmit = () => {
    setLoading(true);

    const valuesArray = inputValues.split(',').map(value => value.trim());

    if (uploadedImage) {
      const formData = new FormData();
      formData.append('file', uploadedImage);
      formData.append('word_check_list', JSON.stringify([...valuesArray, selectedOption]));
      formData.append('fuzz_match', false);
      formData.append('match_case', false);
      formData.append('distance_cutoff', 1);

      fetch(`https://ai-tools.dev.bhasai.samagra.io/ocr/pytesseract_word_check/`, {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setJsonData(data);
          setShowData(true);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error submitting photo:', error);
          setLoading(false);
        });
    }
  };

  const handleGoBack = () => {
    setSelectedOption(options[0].value);
    setShowData(false);
    setJsonData(null);
    setInputValues(options[0].value);
    setUploadedImage(null);
    setImageUrl(null);
    setLoading(false);

    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleFeedbackSubmit = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setComment('');
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    // Here you can submit the comment
    console.log('Comment:', comment);
    handleModalClose();
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    if (!isExpanded) {
      // Reset the state when accordion is closed
      setSelectedOption(options[0].value);
      setShowData(false);
      setJsonData(null);
      setInputValues(options[0].value);
      setUploadedImage(null);
      setImageUrl(null);
      setLoading(false);
    }
  };

  return (
    <Container className="container">
      <Accordion onChange={handleAccordionChange()}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Document Type Validation</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="form">
            <Grid container alignItems="center" spacing={2}>
              {/* Document Type */}
              <Grid item>
                <Typography variant="h6">Document Type:</Typography>
              </Grid>
              <Grid item xs>
                <FormControl fullWidth>
                  <InputLabel 
                    id="option-select-label" 
                    className="inputLabelHover" 
                  ></InputLabel>
                  <Select
                    labelId="option-select-label"
                    id="option-select"
                    value={selectedOption}
                    onChange={handleOptionChange}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container alignItems="center" spacing={8.5}>
              {/* Keywords */}
              <Grid item>
                <Typography variant="h6">Keywords:</Typography>
                <br></br>
              </Grid>
              <Grid item xs>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={inputValues}
                  onChange={handleInputChange}
                  placeholder="Enter comma-separated values"
                  style={{ marginTop: '10px' }}
                />
                {/* Sample Text */}
                 <Typography variant="body2" style={{ marginTop: '10px', textAlign: 'left' }}>Samples: {exampleTexts[selectedOption]}</Typography>
              </Grid>
            </Grid>
            <Box mt={2} /> 
            { !showData && isMobile && (
              <div className="fileInputLabelContainer">
                <Button variant="contained" component="label" className="fileInputLabel">
                  Capture an image
                  <input id="capture-input" type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: 'none' }} />
                </Button>
                <Button variant="contained" component="label" className="fileInputLabel">
                  <IconButton component="span">
                    <SearchIcon/> 
                  </IconButton>
                  Select File(s)
                  <input id="file-input" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </Button>
              </div>
            )}
            { !showData && !isMobile && (
             
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="contained" component="label" className="fileInputLabel" style={{ marginRight: '10px' }}>
                  <SearchIcon style={{ marginRight: '5px' }} />
                  Select File(s)
                  <input id="file-input" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </Button>
                {imageUrl && <img src={imageUrl} alt="Uploaded" className="uploadedImage" />}
              </div>
            )}
            {imageUrl && <Typography variant="h6"> </Typography>}
            {!showData && uploadedImage && !loading ?  <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                className="submitButton"
                sx={{ fontSize: '20px', padding: '12px 24px', width: '100%' }} // Adjust size as needed
              >
                Submit for Validation
              </Button> : null}
            {loading && <Typography>Loading...</Typography>}
          </div>
          {showData && jsonData && (
        <div className="result">
  <Grid container spacing={2}>
    <Grid item xs={4} sm={3} md={2} lg={1}>
      <Typography variant="h6" align="left">Result:</Typography>
    </Grid>
    <Grid item xs={8} sm={9} md={10} lg={11}>
      <Typography variant="body1" align="right" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {jsonData && jsonData.match_status && Object.entries(jsonData.match_status).map(([key, value]) => (
          <div key={key}>
            <p>{key}: {value === 0 ? 'No match' : 'Match'}</p>
          </div>
        ))}
      </Typography>
    </Grid>
  </Grid>
  <div className="buttonContainer" style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button variant="contained" color="secondary" onClick={handleGoBack} className="goBackBtn">Reset</Button>
      <Button variant="contained" onClick={handleFeedbackSubmit} className="submitFeedbackButton">Report Issue</Button>
    </div>
  </div>
</div>


          )}
        </AccordionDetails>
      </Accordion>

      {/* Additional Empty Accordions */}
      <Accordion onChange={handleAccordionChange('panel2')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Data Extraction</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Empty Form */}
          <div>
            <Typography variant="body1">Empty Form 2</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion onChange={handleAccordionChange('panel3')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4">Transcription</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Empty Form */}
          <div>
            <Typography variant="body1">Empty Form 3</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Report Issue Modal */}
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Report Issue</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Please provide details about the issue:</Typography>
          <TextareaAutosize
            aria-label="issue-comment"
            placeholder="Type your comment here..."
            rowsMin={6}
            value={comment}
            onChange={handleCommentChange}
            style={{ width: '100%', marginTop: '10px', resize: 'vertical' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCommentSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
