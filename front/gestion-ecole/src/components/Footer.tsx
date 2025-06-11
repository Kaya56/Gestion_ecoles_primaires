import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        mt: 'auto',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Gestion École © {new Date().getFullYear()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Développé par [Ton Nom ou Ton Équipe]
      </Typography>
    </Box>
  );
};

export default Footer;