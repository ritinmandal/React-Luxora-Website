import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import { supabase, getAvatarUrl } from "../Superbase/supabaseClient";
import HotelIcon from "@mui/icons-material/Hotel";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import ReceiptIcon from "@mui/icons-material/Receipt";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    avatarUrl: "",
  });
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) return;

      const { data: userData } = await supabase
        .from("users")
        .select("name, email, avatar_url,phone")
        .eq("id", userId)
        .single();

      let avatarUrl = "/default-avatar.png";
      if (userData?.avatar_url) {
        try {
          const url = await getAvatarUrl(userData.avatar_url);
          if (url) avatarUrl = url;
        } catch {
          avatarUrl = "/default-avatar.png";
        }
      }

      setUserInfo({
        name: userData?.name || "",
        email: userData?.email || "",
        avatarUrl,
        phone: userData?.phone || "",
      });

      const { data: bookingData, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error) setBookings(bookingData || []);
    };

    fetchUserAndBookings();
  }, []);

  return (
    <Box mt={10} px={{ xs: 2, md: 6 }} pb={6}>
      <Box textAlign="center" mb={4}>
        <Typography sx={{fontFamily: `'Playfair Display', serif`}} variant="h3" fontWeight="bold" gutterBottom>
          My Dashboard
        </Typography>
        <Typography sx={{fontFamily: `'Playfair Display', serif`}} variant="h6" color="text.secondary">
          Manage your bookings and profile here
        </Typography>
      </Box>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, mb: 5 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          alignItems="center"
        >
          <Avatar src={userInfo.avatarUrl} sx={{ width: 100, height: 100 }} />
          <Box>
            <Typography sx={{fontFamily: `'Playfair Display', serif`}} variant="h5" fontWeight="bold">Name:
              {userInfo.name}
            </Typography>

            <Typography color="text.secondary">Email : {userInfo.email}</Typography>
            <Typography color="text.secondary">Phone : {userInfo.phone}</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Dashboard;
