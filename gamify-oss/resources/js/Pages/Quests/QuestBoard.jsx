import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Link } from '@mui/material';

import MapRoundedIcon from '@mui/icons-material/MapRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuestCard from '@/Components/QuestCard';

export default function QuestBoard() {
    return (
        <MainLayout
        >
            <Head title="QuestBoard" />

            <Box>
                <div className="mx-auto max-w-7xl">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
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

                            {/* Project info */}
                            <Box sx={{ py: 2 }}>
                                <Typography sx={{ py: 1 }}>
                                    <InfoOutlinedIcon sx={{ mr: 1 }} />
                                    Project Info
                                </Typography>
                                <Typography>
                                    Project name: ASE Lab Game Dev Project 001
                                </Typography>
                                <Typography>
                                    Project repo:
                                    <Link href="https://github.com/F201/aselab-game-dev-open-project_001" underline="hover" sx={{ ml: 1 }}>click here</Link>
                                </Typography>
                            </Box>

                            {/* Quest List */}
                            <Box sx={{

                            }}>
                                <QuestCard
                                    questTitle='Membutuhkan definisi "fun" yang lebih jelas pada design document'
                                    playerLevel='3'
                                    requiredLevel='3'
                                    difficulty='Easy'
                                    xpReward='75'
                                    role='Game Designer'
                                    proficiencyReward='100'
                                />
                                <QuestCard
                                    questTitle='Membutuhkan script untuk membuat karakter bergerak'
                                    playerLevel='3'
                                    requiredLevel='3'
                                    difficulty='Medium'
                                    xpReward='150'
                                    role='Game Programmer'
                                    proficiencyReward='200'
                                />
                                <QuestCard
                                    questTitle='Membutuhkan aset dari main character'
                                    playerLevel='3'
                                    requiredLevel='4'
                                    difficulty='Hard'
                                    xpReward='300'
                                    role='Game Artist'
                                    proficiencyReward='300'
                                />
                            </Box>
                        </Box>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
}
