import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Paper,
  Avatar,
  Button,
  useTheme,
} from "@mui/material";
import { Add, Remove, Delete } from "@mui/icons-material";
import CartBanner from "../Components/CartBanner";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../Superbase/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const MyCart = () => {
  const [roomCart, setRoomCart] = useState([]);
  const [foodCart, setFoodCart] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const fetchCartData = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;

    const { data: rooms } = await supabase.from("Cart").select("*").eq("user_id", userId);
    const { data: foods } = await supabase.from("CartFood").select("*").eq("user_id", userId);

    setRoomCart(rooms.map((r) => ({ ...r, nights: r.nights ?? 1 })));
    setFoodCart(foods.map((f) => ({ ...f, quantity: f.quantity ?? 1 })));
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const handleQuantityChange = (type, id, operation) => {
    const adjust = (prev, key) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [key]: operation === "inc" ? item[key] + 1 : Math.max(1, item[key] - 1),
            }
          : item
      );

    if (type === "room") setRoomCart((prev) => adjust(prev, "nights"));
    else setFoodCart((prev) => adjust(prev, "quantity"));
  };

  const handleDelete = async (type, id) => {
    try {
      const table = type === "room" ? "Cart" : "CartFood";
      await supabase.from(table).delete().eq("id", id);
      toast.success(`${type === "room" ? "Room" : "Food"} removed from cart`);
      fetchCartData();
    } catch (error) {
      toast.error("Error removing item");
    }
  };

  const handlePayment = async () => {
    if (roomCart.length === 0 && foodCart.length === 0) {
      toast.error("Please select at least one room or one food item.");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return toast.error("Login required");

    const bookingId = uuidv4();
    const orderDetails = {
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email,
      userImage: user.user_metadata?.avatar_url,
      rooms: roomCart,
      foods: foodCart,
      roomTotal,
      foodTotal,
      total: grossTotal,
      bookingId,
    };
 await Promise.all([
    supabase.from("Cart").delete().eq("user_id", user.id),
    supabase.from("CartFood").delete().eq("user_id", user.id),
  ]);
    navigate("/payment_gateway", { state: orderDetails });
  };

  const roomTotal = roomCart.reduce((acc, item) => acc + (item.price || 0) * (item.nights || 1), 0);
  const foodTotal = foodCart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const grossTotal = roomTotal + foodTotal;

  const tableHeaderStyle = {
    backgroundColor: isDark ? "#222" : "#111",
  };

  const tableCellStyle = {
    color: isDark ? "#eab676" : "#eab676",
  };

  return (
    <>
      <CartBanner />
      <Box mt={2} p={4}>
        <Typography variant="h5" fontWeight="bold" color="#eab676">
          Room Bookings
        </Typography>
        <Paper elevation={4} sx={{ my: 2, backgroundColor: isDark ? "#1a1a1a" : "#fff" }}>
          <Table>
            <TableHead sx={tableHeaderStyle}>
              <TableRow>
                <TableCell sx={tableCellStyle}>Image</TableCell>
                <TableCell sx={tableCellStyle}>Room Name</TableCell>
                <TableCell sx={tableCellStyle}>Type</TableCell>
                <TableCell sx={tableCellStyle}>Price</TableCell>
                <TableCell sx={tableCellStyle}>Nights</TableCell>
                <TableCell sx={tableCellStyle}>Subtotal</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {roomCart.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <Avatar variant="rounded" src={room.image_url} alt={room.name} sx={{ width: 76, height: 66 }} />
                  </TableCell>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>₹{room.price}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleQuantityChange("room", room.id, "dec")}><Remove /></IconButton>
                    {room.nights}
                    <IconButton onClick={() => handleQuantityChange("room", room.id, "inc")}><Add /></IconButton>
                  </TableCell>
                  <TableCell>₹{room.price * room.nights}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete("room", room.id)}><Delete sx={{ color: "red" }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 4 }}>
          <Link to="/rooms">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#bfa26c",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#a88d59" },
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Add More Rooms
            </Button>
          </Link>
        </Box>

        <Typography variant="h5" fontWeight="bold" color="#eab676">
          Food Orders
        </Typography>
        <Paper elevation={4} sx={{ my: 1, backgroundColor: isDark ? "#1a1a1a" : "#fff" }}>
          <Table>
            <TableHead sx={tableHeaderStyle}>
              <TableRow>
                <TableCell sx={tableCellStyle}>Image</TableCell>
                <TableCell sx={tableCellStyle}>Dish</TableCell>
                <TableCell sx={tableCellStyle}>Cuisine</TableCell>
                <TableCell sx={tableCellStyle}>Price</TableCell>
                <TableCell sx={tableCellStyle}>Quantity</TableCell>
                <TableCell sx={tableCellStyle}>Subtotal</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {foodCart.map((food) => (
                <TableRow key={food.id}>
                  <TableCell>
                    <Avatar variant="rounded" src={food.image_url} alt={food.name} sx={{ width: 76, height: 66 }} />
                  </TableCell>
                  <TableCell>{food.name}</TableCell>
                  <TableCell>{food.cuisine}</TableCell>
                  <TableCell>₹{food.price}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleQuantityChange("food", food.id, "dec")}><Remove /></IconButton>
                    {food.quantity}
                    <IconButton onClick={() => handleQuantityChange("food", food.id, "inc")}><Add /></IconButton>
                  </TableCell>
                  <TableCell>₹{food.price * food.quantity}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleDelete("food", food.id)}><Delete sx={{ color: "red" }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 4 }}>
          <Link to="/dine">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#bfa26c",
                color: "#ffffff",
                "&:hover": { backgroundColor: "#a88d59" },
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Add More Food
            </Button>
          </Link>
        </Box>

        <Typography variant="h6" sx={{ mt: 4, fontWeight: "bold", color: "#43a047", textAlign: "right" }}>
          Gross Total: ₹{grossTotal}
        </Typography>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#bfa26c",
              color: "#ffffff",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": { backgroundColor: "#a88d59" },
            }}
            onClick={handlePayment}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default MyCart;
