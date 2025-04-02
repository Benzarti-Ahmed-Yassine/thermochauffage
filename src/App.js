import React, { useState } from 'react';
import MoldForm from './components/MoldForm';
import ResistanceGrid from './components/ResistanceGrid';
import ResultsDisplay from './components/ResultsDisplay';
import { Container, Typography, Box, Button } from '@mui/material';
import './App.css';

function App() {
  const [moldCount, setMoldCount] = useState(1);
  const [molds, setMolds] = useState([]);
  const [results, setResults] = useState(null);
  const [gridData, setGridData] = useState(Array(5).fill(Array(5).fill(0)));

  const handleMoldCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    if (count < 1 || count > 5) return;
    setMoldCount(count);
    setMolds(Array(count).fill({}));
  };

  const updateMoldData = (index, data) => {
    const newMolds = [...molds];
    newMolds[index] = data;
    setMolds(newMolds);
  };

  const calculate = async () => {
    try {
      const backendUrl = 'https://thermochauffage-backend.onrender.com/calculate';
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ molds }),
      });
      const data = await response.json();
      setResults(data.results);
      setGridData(data.gridTemperatures);
    } catch (error) {
      console.error('Error calculating:', error);
      setResults('Erreur lors du calcul. Vérifiez la connexion au backend.');
    }
  };

  return (
    <Container maxWidth="lg" className="App">
      <Typography variant="h3" align="center" gutterBottom>
        Thermochauffage
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Nombre de Moules</Typography>
        <input
          type="number"
          value={moldCount}
          onChange={handleMoldCountChange}
          min="1"
          max="5"
          style={{ width: '60px', padding: '5px' }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        {Array.from({ length: moldCount }).map((_, idx) => (
          <MoldForm key={idx} index={idx} onUpdate={updateMoldData} />
        ))}
      </Box>

      <Button variant="contained" color="primary" onClick={calculate} sx={{ mb: 4 }}>
        Calculer
      </Button>

      <ResistanceGrid gridData={gridData} />
      {results && <ResultsDisplay results={results} />}
    </Container>
  );
}

export default App;
