import React from 'react';
import logo from './assets/logo.webp'; // Ensure logo.webp exists in src/assets
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import FormCreate from './pages/FormCreate';
import FormPreview from './pages/FormPreview';
import MyForms from './pages/MyForms';

const App: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F6F1E7', // cream background
      }}
    >
      <AppBar
        position="static"
        elevation={6}
        sx={{
          background: 'rgba(61, 44, 141, 0.9)', // Dark Blue/Purple with some transparency
          backdropFilter: 'blur(6px)',
          py: 1.2,
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap', // enable wrapping on small screens
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: { xs: 28, sm: 36 }, // responsive height
              mr: { xs: 1, sm: 2 },
              flexShrink: 0,
              display: 'block',
            }}
          />
          <Typography
            variant={isSmallScreen ? 'h6' : 'h5'}
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              color: '#F6F1E7', // cream text color
              letterSpacing: '0.03em',
              fontFamily: 'Segoe UI, sans-serif',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              minWidth: { xs: '100%', sm: 'auto' },
              textAlign: { xs: 'center', sm: 'left' }, // center on small screens
            }}
          >
            Form Builder - upliance.ai
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/myforms" replace />} />
          <Route path="/create" element={<FormCreate />} />
          <Route path="/preview" element={<FormPreview />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
