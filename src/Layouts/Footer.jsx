import React from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Container,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Pinterest,
  Close,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const galleryImages = [
  'https://wallpaperaccess.com/full/902484.jpg',
  'https://wallpaperaccess.com/full/5655394.jpg',
  'https://wallpaperaccess.com/full/5571334.jpg',
  'https://wallpaperaccess.com/full/8183871.jpg',
  'https://wallpaperaccess.com/full/8183878.jpg',
  'https://wallpaperaccess.com/full/8183882.jpg',
];

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#111', color: '#fff', pt: 2, pb: 5, px: 3 }}>
      <Box sx={{ backgroundColor: '#c59d5f', height: 80 }} />

      <Container maxWidth="xl" sx={{ mt: -6 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ backgroundColor: '#1c1c1c', p: 3,mx: -2, borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 'bold',
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src="/logo-bg1.png"
                  alt="Royella"
                  sx={{ height: 40, mb: 5 }}
                />
                <div style={{ color: '#c59d5f', marginTop: '-50px' }}>
                  Luxora Resorts
                </div>
                <br />
                <Typography variant="caption" sx={{ color: '#aaa' }}>
                  LUXURY HOTEL
                </Typography>
              </Typography>

              <Divider sx={{ bgcolor: '#c59d5f', width: 40, mb: 2 }} />

              <Typography variant="body2" sx={{ mb: 1 }}>
                📞 +980 (1234) 567 220
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                ✉ example@yahoo.com
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                📍 102/B New Elephant Rd Dhaka – 1212
              </Typography>

              <Box>
                <IconButton sx={{ color: '#c59d5f' }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: '#c59d5f' }}>
                  <Close />
                </IconButton>
                <IconButton sx={{ color: '#c59d5f' }}>
                  <Instagram />
                </IconButton>
                <IconButton sx={{ color: '#c59d5f' }}>
                  <Pinterest />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Playfair Display, serif', mb: 2 }}
            >
              USEFUL LINKS
            </Typography>
            <Divider
              sx={{
                bgcolor: '#c59d5f',
                width: 40,
                mb: 2,
                fontFamily: `'Playfair Display', serif`,
              }}
            />

            {[
              { text: 'About Hotel', path: '/about' },
              { text: 'Rooms & Suites', path: '/rooms' },
              { text: 'Reservations', path: '/reservations' },
              { text: 'News & Blogs', path: '/blogs' },
              { text: 'Contact', path: '/contact' },
            ].map(({ text, path }) => (
              <Typography
                key={text}
                component={Link}
                to={path}
                variant="body2"
                sx={{
                  mb: 1,
                  fontFamily: `'Playfair Display', serif`,
                  color: '#ccc',
                  textDecoration: 'none',
                  listStyleType: 'none',
                  display: 'block',
                  '&:hover': { color: '#c59d5f' },
                }}
              >
                {text}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Playfair Display, serif', mb: 2 }}
            >
              GALLERY
            </Typography>
            <Divider sx={{ bgcolor: '#c59d5f', width: 40, mb: 2 }} />
            <Grid container spacing={1}>
              {galleryImages.map((src, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    component="img"
                    src={src}
                    alt={`gallery-${index}`}
                    sx={{
                      width: '100%',
                      height: 60,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Playfair Display, serif', mb: 2 }}
            >
              NEWSLETTER
            </Typography>
            <Divider sx={{ bgcolor: '#c59d5f', width: 40, mb: 2 }} />
            <Typography variant="body2" sx={{ mb: 2 }}>
              Subscribe our Newsletter
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter Your Email..."
              sx={{
                input: {
                  color: '#000',
                  backgroundColor: '#fff',
                  p: 1.2,
                },
                mb: 2,
                borderRadius: 1,
              }}
            />
            <Button
              fullWidth
              sx={{
                backgroundColor: '#c59d5f',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#b68b48',
                },
              }}
            >
              Subscribe
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Box
        sx={{
          textAlign: 'center',
          mt: 6,
          pt: 3,
          borderTop: '1px solid #333',
          color: '#aaa',
        }}
      >
        <Typography variant="caption">
          © 2025, Luxora. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
