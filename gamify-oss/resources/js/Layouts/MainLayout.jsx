import React, { useState } from 'react';
import { Box, AppBar, CssBaseline, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Link, usePage } from '@inertiajs/react';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import Dropdown from '@/Components/Dropdown';
import Sidebar from '@/Components/Sidebar';
import InfoModal from '@/Components/InfoModal'; 

export default function MainLayout({ children }) {
    const user = usePage().props.auth.user;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);  // Added state

    const drawerWidth = 275;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box className="min-h-screen bg-gray-100">
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '100vh',
                }}
            >
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: '100%', // Full width app bar
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                >
                    <Toolbar>
                        {/* Hamburger menu for mobile */}
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { md: 'none' }, color: 'white' }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {/* Logo */}
                        <Box>
                            <Link href="/">
                                <img src="/images/logo-no-text-white.png" width="40" alt="Logo" />
                            </Link>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* Info Icon - Added */}
                        <IconButton
                            color="inherit"
                            onClick={() => setInfoModalOpen(true)}
                            aria-label="information"
                            sx={{ mr: 2, color: 'white' }}
                        >
                            <HelpOutlineOutlinedIcon />
                        </IconButton>

                        {/* Username and Dropdown */}
                        <Box className="hidden sm:flex sm:items-center">
                            <Box className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:text-white-100 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("profile.show")}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("profile.edit")}>
                                            Settings
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("logout")} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Sidebar component */}
                <Sidebar
                    width={drawerWidth}
                    username={user.name}
                    role={user.role}
                    avatar={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />

                {/* Main content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                        mt: { xs: 8, sm: 8 },
                        //ml: { md: `${drawerWidth}px` },
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            width: '100%',
                            height: '100%',
                            borderRadius: 3,
                            boxShadow: 3,
                            bgcolor: 'white',
                            overflow: 'auto',
                            mb: 2,
                        }}
                    >
                        {children}
                    </Box>
                </Box>
                
                {/* Info Modal - Added */}
                <InfoModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
            </Box>
        </Box>
    );
}