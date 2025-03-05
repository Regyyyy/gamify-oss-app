import { Head, useForm } from '@inertiajs/react';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Paper, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import PrimaryButton from '@/Components/PrimaryButton';

export default function AddNewQuest() {
    const { data, setData, post, processing, errors, reset, setError } = useForm({
        title: '',
        description: '',
        issue_link: '',
        role: 'None',
        difficulty: 'Easy',
        xp_reward: 100,
        proficiency_reward: 0,
    });

    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('quests.store'), {
            onSuccess: () => {
                reset();
                setSuccessMessage('Quest created successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Add New Quest" />
            <Box className="p-10 text-gray-900">
                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'center', mb: 3 }}>
                    <AddIcon sx={{ fontSize: 38, mr: 1 }} />
                    Add New Quest
                </Typography>

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {successMessage}
                    </Alert>
                )}

                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Quest Title*
                            </Typography>
                            <TextField
                                fullWidth
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Enter quest title"
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                Description*
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Enter detailed quest description"
                                error={!!errors.description}
                                helperText={errors.description || ""}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                GitHub Issue Link
                            </Typography>
                            <TextField
                                fullWidth
                                value={data.issue_link}
                                onChange={e => setData('issue_link', e.target.value)}
                                placeholder="https://github.com/organization/repo/issues/123"
                                error={!!errors.issue_link}
                                helperText={errors.issue_link || "Add the direct link to the GitHub issue this quest is based on"}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 3 }}>
                            <FormControl fullWidth>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Role
                                </Typography>
                                <Select
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    error={!!errors.role}
                                >
                                    <MenuItem value="None">None</MenuItem>
                                    <MenuItem value="Game Designer">Game Designer</MenuItem>
                                    <MenuItem value="Game Artist">Game Artist</MenuItem>
                                    <MenuItem value="Game Programmer">Game Programmer</MenuItem>
                                    <MenuItem value="Audio Composer">Audio Composer</MenuItem>
                                </Select>
                                {errors.role && (
                                    <Typography color="error" variant="caption">
                                        {errors.role}
                                    </Typography>
                                )}
                            </FormControl>

                            <FormControl fullWidth>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Difficulty
                                </Typography>
                                <Select
                                    value={data.difficulty}
                                    onChange={e => setData('difficulty', e.target.value)}
                                    error={!!errors.difficulty}
                                >
                                    <MenuItem value="Easy">Easy</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="Hard">Hard</MenuItem>
                                </Select>
                                {errors.difficulty && (
                                    <Typography color="error" variant="caption">
                                        {errors.difficulty}
                                    </Typography>
                                )}
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    XP Reward*
                                </Typography>
                                <TextField
                                    type="number"
                                    fullWidth
                                    value={data.xp_reward}
                                    onChange={e => setData('xp_reward', e.target.value)}
                                    inputProps={{ min: 0 }}
                                    error={!!errors.xp_reward}
                                    helperText={errors.xp_reward}
                                />
                            </Box>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Proficiency Reward
                                </Typography>
                                <TextField
                                    type="number"
                                    fullWidth
                                    value={data.proficiency_reward}
                                    onChange={e => setData('proficiency_reward', e.target.value)}
                                    inputProps={{ min: 0 }}
                                    error={!!errors.proficiency_reward}
                                    helperText={errors.proficiency_reward}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <PrimaryButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={processing}
                                startIcon={<AddIcon />}
                            >
                                Add Quest
                            </PrimaryButton>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </MainLayout>
    );
}