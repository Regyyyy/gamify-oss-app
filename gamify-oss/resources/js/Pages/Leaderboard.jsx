import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';
import { blue, green, grey, orange, red, yellow } from "@mui/material/colors";

const players = [
    { avatar: '/avatars/player1.png', name: 'Alice', xp: 1200 },
    { avatar: '/avatars/player2.png', name: 'Bob', xp: 950 },
    { avatar: '/avatars/player3.png', name: 'Charlie', xp: 800 },
    { avatar: '/avatars/player4.png', name: 'Dave', xp: 600 },
    { avatar: '/avatars/player5.png', name: 'Eve', xp: 500 }
];

const sortedPlayers = [...players].sort((a, b) => b.xp - a.xp);

// Colors for top 3 players
const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

export default function Leaderboard() {
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
                <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, overflow: 'hidden', px: 2 }}>
                    <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px', width: '100%' }}>
                        <TableHead>
                            <TableRow sx={{
                                '& th': {
                                    color: 'grey.500'
                                }
                            }}>
                                <TableCell>Rank</TableCell>
                                <TableCell>Player</TableCell>
                                <TableCell>XP</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedPlayers.map((player, index) => {
                                const borderColor = index < 3 ? rankColors[index] : 'black'; // Top 3 get color, others grey

                                return (
                                    <TableRow
                                        key={player.name}
                                        sx={{
                                            border: `3px solid ${borderColor}`,
                                            borderRadius: '12px',
                                            '& td': { borderBottom: 'none' }, // Remove inner row lines
                                        }}
                                    >
                                        <TableCell sx={{ width: '10%' }}>
                                            <Typography sx={{ fontWeight: 'bold', color: borderColor }}>
                                                {index + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar src={player.avatar} alt={player.name} />
                                                <Typography>{player.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ width: '10%' }}>
                                            <Typography fontWeight="bold">{player.xp}</Typography>
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
