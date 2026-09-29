import React from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  Link,
  Tooltip,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 4 }}>
      <Container maxWidth="lg">
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', py: 2 }}>
          <Box sx={{ flexGrow: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              DevOps Practice Platform &copy; {new Date().getFullYear()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="GitHub">
              <Link href="https://github.com/yourusername" target="_blank" rel="noopener" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
                <GitHubIcon fontSize="inherit" />
              </Link>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <Link href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener" sx={{ color: 'text.secondary', textDecoration: 'none' }}>
                <LinkedInIcon fontSize="inherit" />
              </Link>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
