import { Head, useForm } from '@inertiajs/react';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Paper, Alert, Avatar } from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEvents';
import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

export default function RewardBadge() {
    const [users, setUsers] = useState([]);
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        badge_id: '',
    });

    useEffect(() => {
        // Fetch users and badges when component mounts
        const fetchData = async () => {
            try {
                const [usersResponse, badgesResponse] = await Promise.all([
                    axios.get(route('admin.users.list')),
                    axios.get(route('admin.badges.list'))
                ]);
                
                setUsers(usersResponse.data.users);
                setBadges(badgesResponse.data.badges);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Failed to load users and badges data. Please try again.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('admin.badges.award.store'), {
            onSuccess: () => {
                reset();
                setSuccessMessage('Badge awarded successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                if (errors.badge_exists) {
                    setErrorMessage(errors.badge_exists);
                } else {
                    setErrorMessage('Failed to award badge. Please check the form and try again.');
                }
                setTimeout(() => setErrorMessage(''), 5000);
            }
        });
    };

    const getBadgeImagePath = (badgeId) => {
        const imagePaths = {
            1: '/images/badges/questioner-badge-gold.png',
            2: '/images/badges/helper-badge-gold.png',
            3: '/images/badges/level-badge.png',
        };

        return imagePaths[badgeId] || '/images/badges/default-badge.png';
    };

    return (
        <MainLayout>
            <Head title="Award Badge" />
            <Box className="p-10 text-gray-900">
                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'center', mb: 3 }}>
                    <EmojiEventsRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                    Award Badge
                </Typography>

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {successMessage}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Award a Badge
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Select a user and a badge to award. This recognizes user contributions to the project based on their activities.
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth error={!!errors.user_id}>
                                <InputLabel id="user-select-label">User</InputLabel>
                                <Select
                                    labelId="user-select-label"
                                    id="user-select"
                                    value={data.user_id}
                                    label="User"
                                    onChange={e => setData('user_id', e.target.value)}
                                    disabled={processing || loading}
                                >
                                    <MenuItem value=""><em>Select a user</em></MenuItem>
                                    {users.map(user => (
                                        <MenuItem key={user.user_id} value={user.user_id}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar 
                                                    src={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                                    sx={{ width: 32, height: 32 }}
                                                />
                                                <Typography>
                                                    {user.name} (Level {user.level})
                                                </Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.user_id && (
                                    <Typography color="error" variant="caption">
                                        {errors.user_id}
                                    </Typography>
                                )}
                            </FormControl>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <FormControl fullWidth error={!!errors.badge_id}>
                                <InputLabel id="badge-select-label">Badge</InputLabel>
                                <Select
                                    labelId="badge-select-label"
                                    id="badge-select"
                                    value={data.badge_id}
                                    label="Badge"
                                    onChange={e => setData('badge_id', e.target.value)}
                                    disabled={processing || loading}
                                >
                                    <MenuItem value=""><em>Select a badge</em></MenuItem>
                                    {badges.map(badge => (
                                        <MenuItem key={badge.badge_id} value={badge.badge_id}>
                                            {badge.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.badge_id && (
                                    <Typography color="error" variant="caption">
                                        {errors.badge_id}
                                    </Typography>
                                )}
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <PrimaryButton
                                type="submit"
                                disabled={processing || loading || !data.user_id || !data.badge_id}
                            >
                                Award Badge
                            </PrimaryButton>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </MainLayout>
    );
}