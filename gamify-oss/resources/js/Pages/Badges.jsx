import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Link } from '@mui/material';

import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

export default function Badges() {
    return (
        <MainLayout
        >
            <Head title="Badges" />

            <Box>
                <div className="">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
                            <Box>
                                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                                    <EmojiEventsRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Badges
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                    Get your special badges and show them in your profile by completing various activities in the project!
                                </Typography>
                            </Box>

                            {/* Achievements */}
                            <Box>

                            </Box>
                        </Box>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
}
