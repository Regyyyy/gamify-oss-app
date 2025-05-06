import { Head, Link } from '@inertiajs/react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Home({ auth }) {
    const theme = useTheme();

    return (
        <>
            <Head title="Home" />
            <Box
                sx={{
                    bgcolor: 'white',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 8
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', mb: 6 }}>
                        {/* Application Logo */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            width: '100%',
                        }}>
                            <Link href="/">
                                <img src="/images/logo-vertical.png" width="150" height="auto" alt="ASE Logo" />
                            </Link>
                        </Box>

                        <Typography variant="h2" fontWeight="bold" gutterBottom>
                            ASE <Box component="span" sx={{ color: theme.palette.primary.main }}>Gamified</Box> OSS
                        </Typography>

                        <Typography variant="h6" sx={{ mb: 5, mt: 3, color: 'text.secondary' }}>
                            Contribute to Open Source Software in a fun and engaging way!
                        </Typography>

                        <Typography variant="body1" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
                            Experience a new approach to Open Source contribution through our gamified platform.
                            Complete quests, level up your skills, team up with other contributors,
                            earn badges, climb the leaderboard, and showcase your achievements -
                            all while making meaningful contributions to the project.
                        </Typography>

                        {auth.user ? (
                            <PrimaryButton
                                href={route('questboard')}
                                className="px-8 py-3 text-lg"
                            >
                                View Quest Board
                            </PrimaryButton>
                        ) : (
                            <Stack direction="row" spacing={2} justifyContent="center">
                                <SecondaryButton
                                    href={route('login')}
                                    className="px-8 py-3"
                                >
                                    Log In
                                </SecondaryButton>
                                <PrimaryButton
                                    href={route('register')}
                                    className="px-8 py-3"
                                >
                                    Register
                                </PrimaryButton>
                            </Stack>
                        )}
                    </Box>

                    <Box sx={{
                        textAlign: 'center',
                        mt: 8,
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: 4
                    }}>
                        <Box sx={{ maxWidth: 250, mb: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                                Take Quests
                            </Typography>
                            <Typography variant="body2">
                                Choose from beginner or advanced quests based on your level and contribute to the project.
                            </Typography>
                        </Box>

                        <Box sx={{ maxWidth: 250, mb: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                                Level Up
                            </Typography>
                            <Typography variant="body2">
                                Earn XP and increase your level to unlock more advanced quests and challenges.
                            </Typography>
                        </Box>

                        <Box sx={{ maxWidth: 250, mb: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                                Earn Rewards
                            </Typography>
                            <Typography variant="body2">
                                Collect badges, avatar frames, and increase your proficiency in different roles.
                            </Typography>
                        </Box>

                        <Box sx={{ maxWidth: 250, mb: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                                Team Up
                            </Typography>
                            <Typography variant="body2">
                                Collaborate with other contributors to tackle more challenging quests together.
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
}