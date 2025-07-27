// CartDrawer.js
import React, { useEffect, useState } from 'react';
import {
  Drawer, Box, Typography, IconButton, Button, Divider, Stack, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Superbase/supabaseClient';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const CartDrawer = ({ open, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) fetchCart();
  }, [open]);

  const fetchCart = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) return;

    const [roomRes, foodRes] = await Promise.all([
      supabase.from('Cart').select('*').eq('user_id', user.id),
      supabase.from('CartFood').select('*').eq('user_id', user.id),
    ]);

    if (roomRes.error || foodRes.error) {
      console.error('Failed to fetch cart data');
      return;
    }

    const allItems = [
      ...(roomRes.data || []).map(item => ({ ...item, type: 'room' })),
      ...(foodRes.data || []).map(item => ({ ...item, type: 'food' })),
    ];

    setCartItems(allItems);
    setSubtotal(allItems.reduce((sum, item) => sum + (item.price || 0), 0));
  };

  const handleRemove = async (item) => {
    const table = item.type === 'food' ? 'CartFood' : 'Cart';
    await supabase.from(table).delete().eq('id', item.id);
    fetchCart();
  };

  const handlePayment = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return toast.error("Login required");

    
    const rooms = cartItems.filter(item => item.type === 'room');
    const foods = cartItems.filter(item => item.type === 'food');

    const bookingId = `HTL-${uuidv4().slice(0, 8).toUpperCase()}`;

    const orderDetails = {
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email,
      userImage: user.user_metadata?.avatar_url,
      rooms,
      foods,
      total: subtotal,
      bookingId,
    };

    toast.success("Your Hotel Room is Booked!");

    setTimeout(async () => {
      await Promise.all([
        supabase.from("Cart").delete().eq("user_id", user.id),
        supabase.from("CartFood").delete().eq("user_id", user.id),
      ]);
      onClose();
      navigate("/order_received", { state: orderDetails });
    }, 1200);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, p: 2, position: 'relative', height: '100%' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
          My Cart
        </Typography>

        {cartItems.map((item) => (
          <Box
            key={`${item.type}-${item.id}`}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Box display="flex" gap={2}>
              <Avatar
                variant="rounded"
                src={item.image_url}
                alt={item.name}
                sx={{ width: 64, height: 64 }}
              />
              <Box>
                <Typography>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ₹{item.price}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => handleRemove(item)}>
              <DeleteIcon sx={{ color: 'red' }} />
            </IconButton>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1">Subtotal:</Typography>
          <Typography variant="h6" color="error">₹{subtotal}</Typography>
        </Box>

        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={handlePayment} 
            sx={{
              backgroundColor: '#003300 !important',
              color: 'white!important',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Checkout
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onClose();
              navigate('/cart');
            }}
            sx={{
              backgroundColor: '#bfa26c',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#a8905a' },
            }}
          >
            View Cart
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;
