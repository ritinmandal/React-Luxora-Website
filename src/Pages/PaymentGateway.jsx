import React, { useState } from "react";
import {
  Accordion, AccordionSummary, AccordionDetails,
  Box, Typography, TextField, Button, FormControl,
  RadioGroup, Radio, FormControlLabel, Paper, Divider, Grid,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutBanner from "../Components/CheckoutBanner";
import toast from "react-hot-toast";

const PaymentGateway = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const grossTotal = state?.total || 0;
  const discountedPrice = grossTotal * 0.9;
  const [discountedTotal, setDiscountedTotal] = useState(grossTotal);

  const handleApplyCoupon = () => {
    const entered = coupon.trim().toUpperCase();
    if (entered === "LUXORA10") {
      setDiscountedTotal(discountedPrice);
      setIsCouponApplied(true);
      toast.success("Coupon applied! 10% discount added.");
    } else {
      setDiscountedTotal(grossTotal);
      setIsCouponApplied(false);
      toast.error("Invalid coupon code.");
    }
  };

  const handleCheckout = () => {
    setTimeout(() => {
      toast.success("Your booking is successful!", {
        style: {
          border: "1px solid #c2a15f",
          padding: "16px",
          color: "#4c4c4c",
        },
        iconTheme: { primary: "#c2a15f", secondary: "#ffffff" },
      });

      navigate("/order_received", {
        state: {
          ...state,
          paymentMethod,
          finalTotal: discountedTotal,
          isCouponApplied,
          coupon: isCouponApplied ? coupon.trim().toUpperCase() : null,
        },
      });
    }, 1000);
  };

  const paymentLogos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg", alt: "Visa" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", alt: "MasterCard" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Skrill_logo.svg/852px-Skrill_logo.svg.png", alt: "Skrill" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", alt: "PayPal" },
  ];

  return (
    <>
      <CheckoutBanner />
      <Box sx={{ p: 4, backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            mt: 6,
            ml: { md: '200px' },
            mr: { md: '50px' },
            mb: 4,
          }}
        >
          <Box sx={{ width: { xs: '100%', md: '60%' } }}>
            <Paper sx={{ p: 3 }}>

              
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Have a Coupon? Click Here To Enter Your Code.</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Enter coupon code"
                      size="small"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      sx={{ bgcolor: 'black', color: 'white' }}
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Billing Address</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6}><TextField fullWidth label="First Name" /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="Last Name" /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="Age" /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="Contact" /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Address" /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="Pin Code" /></Grid>
                    <Grid item xs={6}><TextField fullWidth label="Email Address" /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Phone Number" /></Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              <Accordion defaultExpanded sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Payment Method</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      row
                    >
                      <FormControlLabel value="card" control={<Radio />} label="Payment by Card" />
                      <FormControlLabel value="cod" control={<Radio />} label="Pay at Hotel" />
                    </RadioGroup>
                  </FormControl>

                  {paymentMethod === "card" && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                        {paymentLogos.map((logo, idx) => (
                          <Box key={idx} sx={{ border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
                            <Box component="img" src={logo.src} alt={logo.alt} sx={{ height: 40 }} />
                          </Box>
                        ))}
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}><TextField fullWidth label="Card Holder Name" defaultValue="John Doe" /></Grid>
                        <Grid item xs={6}><TextField fullWidth label="Card Number" defaultValue="589622144" /></Grid>
                        <Grid item xs={6}><TextField fullWidth label="CVV" defaultValue="856" /></Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Expire Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.5, bgcolor: '#a88d59', color: 'white' }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Box>

          <Box sx={{ width: { xs: "100%", md: "35%" } }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Cart Total</Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Room Total</Typography>
                <Typography>₹{state?.roomTotal || 0}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography>Food Total</Typography>
                <Typography>₹{state?.foodTotal || 0}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                <Typography>Total Price</Typography>
                <Typography>₹{discountedTotal.toFixed(2)}</Typography>
              </Box>
              {isCouponApplied && (
                <Typography sx={{ mt: 1 }} color="green">
                  Coupon "SAVE10" applied!
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PaymentGateway;
