import React, { useState, useEffect } from 'react';
import { supabase } from '../Superbase/supabaseClient';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  Rating,
  Divider,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);



const Blogs = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('users')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single();

        if (data) setProfile(data);
      }
    };
    fetchUser();
  }, []);

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from('blogs')
      .select('id, title, content, created_at, user_id, author_name, image_url')
      .order('created_at', { ascending: false });

    const enriched = await Promise.all(
      data.map(async (blog) => {
        const { data: userData } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', blog.user_id)
          .single();

        return {
          ...blog,
          avatar_url: userData?.avatar_url || '',
        };
      })
    );

    setBlogs(enriched);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content) return alert('Please fill out all fields');
    const { error } = await supabase.from('blogs').insert([
      {
        title,
        content,
        user_id: user.id,
        author_name: profile.name,
        image_url: profile.image_url,
      },
    ]);
    if (!error) {
      setTitle('');
      setContent('');
      fetchBlogs();
    }
  };

  const gold = '#c5a46d';

  return (
    <Box
      sx={{
        mt: 10,
        mx: 10,
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage:
            'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px) brightness(0.6)',
          zIndex: -1,
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: gold,
          letterSpacing: 2,
          fontWeight: 300,
          textAlign: 'center',
        }}
      >
        LUXURY HOTEL AND RESORT
      </Typography>

      <Typography
        variant="h3"
        sx={{
          color: '#fff',
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          fontFamily: `'Playfair Display', serif`,
        }}
      >
        CLIENT TESTIMONIALS & FEEDBACK
      </Typography>

      {user && (
        <Paper
          elevation={5}
          sx={{
            p: 4,
            mb: 6,
            backgroundColor: isDark ? '#121212' : '#f4f4f4',
            borderRadius: 4,
            color: isDark ? '#fff' : '#000',
            maxWidth: 800,
            mx: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              color: gold,
              fontWeight: 600,
              fontFamily: `'Playfair Display', serif`,
            }}
          >
            Share Your Experience
          </Typography>

          <Divider sx={{ borderColor: isDark ? '#444' : '#ccc', mb: 3 }} />

          <TextField
            label="Blog Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              mb: 3,
              input: { color: isDark ? '#fff' : '#000' },
              '& .MuiInputLabel-root': {
                color: '#aaa',
                '&.Mui-focused': {
                  color: gold,
                },
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: gold },
                '&.Mui-focused fieldset': { borderColor: gold },
              },
            }}
          />

          <TextField
            label="Your Feedback"
            multiline
            rows={5}
            fullWidth
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{
              mb: 4,
              textarea: { color: isDark ? '#fff' : '#000' },
              '& .MuiInputLabel-root': {
                color: '#aaa',
                '&.Mui-focused': {
                  color: gold,
                },
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: gold },
                '&.Mui-focused fieldset': { borderColor: gold },
              },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: gold,
              fontWeight: 'bold',
              fontFamily: `'Playfair Display', serif`,
              '&:hover': { backgroundColor: '#a78958' },
            }}
          >
            Submit Blog
          </Button>
        </Paper>
      )}

      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Box sx={{ textAlign: 'center', position: 'relative' }}>
              <Avatar
                src={blog.avatar_url}
                alt={blog.author_name}
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  zIndex: 2,
                  position: 'relative',
                  mb: -4,
                  border: '3px solid #fff',
                }}
              />

              <MotionBox
                whileHover={{ scale: 1.03 }}
                sx={{
                  backgroundColor: isDark ? '#1e1e1e' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderRadius: 4,
                  px: 3,
                  pt: 5,
                  pb: 4,
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  position: 'relative',
                }}
              >
                <Typography
                  sx={{
                    fontSize: 40,
                    color: gold,
                    position: 'absolute',
                    top: 10,
                    left: 20,
                    fontFamily: 'serif',
                    fontWeight: 'bold',
                  }}
                >
                  “
                </Typography>

                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                  {blog.content}
                </Typography>

                <Rating value={5} readOnly size="small" sx={{ color: gold }} />

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -15,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderTop: `15px solid ${isDark ? '#1e1e1e' : '#fff'}`,
                  }}
                />
              </MotionBox>

              <Box sx={{ mt: 5 }}>
                <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
                  {blog.author_name}
                </Typography>
                <Typography variant="body2" sx={{ color: gold }}>
                  Tourist
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Blogs;
