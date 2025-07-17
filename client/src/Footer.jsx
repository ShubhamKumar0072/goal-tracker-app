import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link
} from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f5f5f5",
        py: 4,
        borderTop: "1px solid #ddd",
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={4}
          justifyContent={{ xs: "center", sm: "space-between" }}
          alignItems="flex-start"
        >
          {/* Contact Us - Left */}
          <Grid item xs={12} sm={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={{ xs: "center", sm: "flex-start" }}
              textAlign={{ xs: "center", sm: "left" }}
            >
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2">
                Email: support@goaltracker.com
              </Typography>
              <Typography variant="body2">
                Phone: +91 98765 43210
              </Typography>
            </Box>
          </Grid>

          {/* Follow Us - Center */}
          <Grid item xs={12} sm={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Box>
                <IconButton
                  href="https://facebook.com"
                  target="_blank"
                  color="inherit"
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  href="https://twitter.com"
                  target="_blank"
                  color="inherit"
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  href="https://instagram.com"
                  target="_blank"
                  color="inherit"
                >
                  <Instagram />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Legal - Right */}
          <Grid item xs={12} sm={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={{ xs: "center", sm: "flex-end" }}
              textAlign={{ xs: "center", sm: "right" }}
            >
              <Typography variant="h6" gutterBottom>
                Legal
              </Typography>
              <Link
                href="/privacy-policy"
                underline="hover"
                color="text.secondary"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-and-conditions"
                underline="hover"
                color="text.secondary"
              >
                Terms & Conditions
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box mt={4}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} GoalTracker. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}