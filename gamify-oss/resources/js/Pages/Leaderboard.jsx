import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";

export default function Leaderboard() {
    // Get users data passed from the controller
    const { users } = usePage().props;

    // Colors for top 3 players
    const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze
    const rankBgColors = ['rgba(255, 215, 0, 0.1)', 'rgba(192, 192, 192, 0.1)', 'rgba(205, 127, 50, 0.1)']; // Light versions

    return (
        <MainLayout>
            <Head title="Leaderboard" />
            <Box className="p-10 text-gray-900">
                {/* Header */}
                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                    <LeaderboardRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                    Leaderboard
                </Typography>
                <Typography sx={{ py: 1 }}>See your progress along with others! Take more quests for more XPs to climb the leaderboard.</Typography>

                {/* Leaderboard Table */}
                <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden', px: 2, py: 2 }}>
                    <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px', width: '100%' }}>
                        <TableHead>
                            <TableRow sx={{
                                '& th': {
                                    color: 'grey.500',
                                    fontWeight: 'bold',
                                    borderBottom: '2px solid #f5f5f5'
                                }
                            }}>
                                <TableCell>Rank</TableCell>
                                <TableCell sx={{ pl: 4 }}>Player</TableCell>
                                <TableCell sx={{ pl: 4 }}>XP</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => {
                                const isTopThree = index < 3;
                                const borderColor = isTopThree ? rankColors[index] : 'transparent';
                                const backgroundColor = isTopThree ? rankBgColors[index] : 'transparent';

                                return (
                                    <TableRow
                                        key={user.user_id}
                                        sx={{
                                            height: '64px',
                                            backgroundColor: backgroundColor,
                                            '& > td': {
                                                borderTop: isTopThree ? `2px solid ${borderColor}` : '1px solid #eaeaea',
                                                borderBottom: isTopThree ? `2px solid ${borderColor}` : '1px solid #eaeaea',
                                            },
                                            '& > td:first-of-type': {
                                                borderTopLeftRadius: '12px',
                                                borderBottomLeftRadius: '12px',
                                                borderLeft: isTopThree ? `2px solid ${borderColor}` : '1px solid #eaeaea',
                                            },
                                            '& > td:last-child': {
                                                borderTopRightRadius: '12px',
                                                borderBottomRightRadius: '12px',
                                                borderRight: isTopThree ? `2px solid ${borderColor}` : '1px solid #eaeaea',
                                            },
                                            '&:hover': {
                                                backgroundColor: isTopThree ? `${rankBgColors[index]}` : 'rgba(0,0,0,0.02)',
                                                transition: 'all 0.2s'
                                            }
                                        }}
                                    >
                                        <TableCell sx={{ width: '10%', pl: 3 }}>
                                            <Typography sx={{ 
                                                fontWeight: 'bold', 
                                                color: isTopThree ? borderColor : 'inherit',
                                                fontSize: isTopThree ? '1.2rem' : '1rem'
                                            }}>
                                                {index + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar 
                                                    src={user.avatar ? `/storage/${user.avatar}` : "/default-avatar.png"} 
                                                    alt={user.name}
                                                    sx={{
                                                        width: isTopThree ? 48 : 40,
                                                        height: isTopThree ? 48 : 40,
                                                        border: isTopThree ? `2px solid ${borderColor}` : 'none'
                                                    }}
                                                />
                                                <Typography
                                                    sx={{ 
                                                        fontWeight: isTopThree ? 'bold' : 'normal',
                                                        fontSize: isTopThree ? '1.1rem' : '1rem'
                                                    }}
                                                >
                                                    {user.name}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ width: '15%' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <BoltRoundedIcon sx={{ 
                                                    color: "#FFC107",
                                                    fontSize: isTopThree ? 28 : 24
                                                }} />
                                                <Typography fontWeight="bold" sx={{
                                                    fontSize: isTopThree ? '1.1rem' : '1rem'
                                                }}>
                                                    {user.xp_point}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </MainLayout>
    );
}