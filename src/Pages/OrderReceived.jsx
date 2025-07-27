import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../Superbase/supabaseClient';
import CheckoutBanner from '../Components/CheckoutBanner';

const OrderReceived = () => {
  const location = useLocation();
  const order = location.state;
  const theme = useTheme();

  const [user, setUser] = useState({ email: '', name: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authUser } = await supabase.auth.getUser();
      const userId = authUser?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('users')
        .select('email, name')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setUser({ email: data.email, name: data.name });
      }
    };

    fetchUser();
  }, []);

  if (!order) return <Typography>Invalid Access</Typography>;

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('🛎️ Hotel Booking Invoice', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(80);

    doc.text(`Customer Name: ${user.name || order.userName}`, 20, 35);
    doc.text(`Customer Email: ${user.email}`, 20, 42);
    doc.text(`Booking ID: ${order.bookingId}`, 20, 49);
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 20, 56);

    if (order.rooms.length > 0) {
      autoTable(doc, {
        startY: 65,
        head: [['Room Name', 'Type', 'Price/Night', 'Nights', 'Subtotal']],
        body: order.rooms.map((r) => [
          r.name,
          r.type,
          `₹${r.price}`,
          r.nights,
          `₹${r.price * r.nights}`,
        ]),
        headStyles: { fillColor: [191, 162, 108] },
      });
    }

    if (order.foods.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Dish', 'Cuisine', 'Price', 'Qty', 'Subtotal']],
        body: order.foods.map((f) => [
          f.name,
          f.cuisine,
          `₹${f.price}`,
          f.quantity,
          `₹${f.price * f.quantity}`,
        ]),
        headStyles: { fillColor: [240, 115, 115] },
      });
    }

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Total Amount: ₹${order.total}`, 20, doc.lastAutoTable.finalY + 20);
    doc.save('Hotel_Booking_Invoice.pdf');
  };

  const isDark = theme.palette.mode === 'dark';
  const bgColor = isDark ? theme.palette.background.paper : '#fff';
  const textColor = isDark ? '#f1f1f1' : '#2c2c2c';
  const subTextColor = isDark ? '#bdbdbd' : '#9e9e9e';

  return (
    <>
      <CheckoutBanner />
      <Box p={4}>
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            mb: 4,
            mt: -1,
            borderRadius: 2,
            backgroundColor: bgColor,
            boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: textColor }}>
              Thank You For Your Booking!
            </Typography>
            <Typography sx={{ color: subTextColor }}>
              Your booking has been <strong>received</strong>
            </Typography>
          </Box>

          <Link to="/">
            <Button
              sx={{
                backgroundColor: '#bfa26c',
                color: '#fff',
                borderRadius: '8px',
                px: 3,
                py: 1,
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { backgroundColor: '#d43f3f' },
              }}
            >
              Back Home
            </Button>
          </Link>
        </Paper>

        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: bgColor,
            color: textColor,
          }}
        >
          <Box mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Booking Summary
            </Typography>
            <Divider sx={{ my: 2, borderColor: isDark ? '#555' : '#ccc' }} />
            <Typography>
              <strong>Name:</strong> {user.name || order.userName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography>
              <strong>Booking ID:</strong> {order.bookingId}
            </Typography>
            <Typography>
              <strong>Total Rooms:</strong> {order.rooms.length}
            </Typography>
            <Typography>
              <strong>Total Food Items:</strong> {order.foods.length}
            </Typography>
            <Typography fontWeight="bold" mt={2}>
              Total Price: ₹{order.total}
            </Typography>
          </Box>

          <Box mt={4} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Button
              onClick={handleDownload}
              sx={{
                backgroundColor: isDark ? '#333' : '#000',
                color: '#fff',
                px: 3,
                py: 1,
                fontWeight: 'bold',
                borderRadius: 1,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: isDark ? '#444' : '#222',
                },
              }}
            >
              Download Your Bill
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default OrderReceived;
