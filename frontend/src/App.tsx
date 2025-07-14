import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import Header from "./components/Header";
import TroubleshootingGuide from "./components/TroubleshootingGuide";
import ManualUpload from "./components/ManualUpload";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<TroubleshootingGuide />} />
            <Route path="/upload" element={<ManualUpload />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;

