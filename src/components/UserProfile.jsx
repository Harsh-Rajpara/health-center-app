import React from 'react';
import { Avatar, Box, Typography, Paper, Chip } from '@mui/material';

function UserProfile() {
  const loginUser = JSON.parse(localStorage.getItem("loginUser"));

  if (!loginUser) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar 
          src={loginUser.photoURL} 
          alt={loginUser.name}
          sx={{ width: 80, height: 80 }}
        />
        <Box>
          <Typography variant="h5">{loginUser.name}</Typography>
          <Typography color="textSecondary">{loginUser.email}</Typography>
          <Chip 
            label={loginUser.role === "admin" ? "Administrator" : "Patient"} 
            color={loginUser.role === "admin" ? "primary" : "default"}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default UserProfile;