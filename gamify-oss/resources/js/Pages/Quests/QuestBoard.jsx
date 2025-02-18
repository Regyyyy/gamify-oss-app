import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Box, Typography } from '@mui/material';
import MapRoundedIcon from '@mui/icons-material/MapRounded';

export default function QuestBoard() {
    return (
        <MainLayout
        >
            <Head title="QuestBoard" />

            <Box>
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">
                            <Box>
                                <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
                                    <MapRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Quest Board
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                Choose quest you want to take! You don’t need any good experience to start, just have fun.
                                </Typography>
                            </Box>
                        </Box>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
}
