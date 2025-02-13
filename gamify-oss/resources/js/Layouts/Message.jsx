import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardContent,
  Chip,
  Pagination,
  Link
} from '@mui/material';
import { styled } from '@mui/system';

const drawerWidth = 240;

// A styled Box for the main content area to offset the drawer’s width
const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.spacing(8), // so content isn't hidden under the AppBar
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: drawerWidth
}));

function QuestBoardPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ backgroundColor: '#ff7700' }}>
        <Toolbar>
          {/* You can place a logo or brand name here */}
          <Typography variant="h6" noWrap component="div">
            AASB
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Avatar
            alt="User Avatar"
            src="https://via.placeholder.com/80"
            sx={{ width: 80, height: 80, margin: '0 auto' }}
          />
          <Typography variant="h6" sx={{ mt: 1 }}>
            username
          </Typography>
        </Box>
        <List>
          {/* Sample menu items */}
          {['Quests', 'Projects', 'Ranks', 'Plan Quests', 'Events', 'Badges'].map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <MainContent>
        {/* Page Title */}
        <Typography variant="h4" gutterBottom>
          Quest Board
        </Typography>

        {/* Project Info Section */}
        <Box
          sx={{
            backgroundColor: '#f9f9f9',
            padding: 2,
            borderRadius: 2,
            mb: 3
          }}
        >
          <Typography variant="h6">Project Info</Typography>
          <Typography variant="body1">Project Name: ASB E-Gara Dev Project_001</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Project Repo:{' '}
            <Link
              href="https://github.com/aasb/e-gara-dev-game-engine-project_001"
              target="_blank"
              rel="noopener"
              underline="hover"
            >
              https://github.com/aasb/e-gara-dev-game-engine-project_001
            </Link>
          </Typography>
        </Box>

        {/* Quest List */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  Membutuhkan script untuk membuat karakter bergerak
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  BeginnerLevel2
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip label="Unresolved" color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Gema Programmer Proficiency +10
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  Membutuhkan asset dan main character
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  BeginnerLevel3
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip label="inprogress" color="warning" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Entry +100
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={3} variant="outlined" shape="rounded" />
        </Box>
      </MainContent>
    </Box>
  );
}

export default QuestBoardPage;
