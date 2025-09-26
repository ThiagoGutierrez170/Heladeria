import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import api from '../../utils/api';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

const BeachDateFilter = ({ onFilter }) => {
  const [beaches, setBeaches] = useState([]);
  const [selectedBeach, setSelectedBeach] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchBeaches = async () => {
      try {
        const response = await api.get('/nota/finalizadas');
        const beachesSet = new Set(response.data.map((nota) => nota.playa));
        setBeaches(Array.from(beachesSet));
      } catch (error) {
        console.error('Error fetching beaches:', error);
      }
    };
    fetchBeaches();
  }, []);

  const handleBeachChange = (event) => {
    setSelectedBeach(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleFilter = () => {
    onFilter({ beach: selectedBeach, startDate, endDate });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" color="black" gutterBottom>

      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel id="beach-select-label">Playas</InputLabel>
            <Select
              labelId="beach-select-label"
              id="beach-select"
              value={selectedBeach}
              onChange={handleBeachChange}
            >
              <MenuItem value="">Todas</MenuItem>
              {beaches.map((beach) => (
                <MenuItem key={beach} value={beach}>
                  {beach}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Desde"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Hasta"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} sx={{ mt: 2, mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleFilter} fullWidth>
            Filtrar
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BeachDateFilter;