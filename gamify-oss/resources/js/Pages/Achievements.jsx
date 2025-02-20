import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Link } from '@mui/material';

import StarRoundedIcon from '@mui/icons-material/StarRounded';

export default function Achievements() {
    return (
        <MainLayout
        >
            <Head title="Achievements" />

            <Box>
                <div className="">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
                            <Box>
                                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                                    <StarRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Achievements
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                    Get more rewards and exclusive items by getting achievements!
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
