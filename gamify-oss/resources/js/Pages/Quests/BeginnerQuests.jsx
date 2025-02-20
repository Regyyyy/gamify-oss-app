import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Link } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuestCard from '@/Components/QuestCard';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';

export default function BeginnerQuest() {
    return (
        <MainLayout
        >
            <Head title="BeginnerQuest" />

            <Box>
                <div className="">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
                            <Box>
                                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                                    <LightbulbRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Beginner Quest
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                    Start your journey with us by taking these quests, leveling up, and unlock new challenges!
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
                                    playerLevel='1'
                                    requiredLevel='1'
                                    difficulty='Easy'
                                    xpReward='75'
                                    role='Game Designer'
                                    proficiencyReward='100'
                                />
                                <QuestCard
                                    questTitle='Membutuhkan script untuk membuat karakter bergerak'
                                    playerLevel='1'
                                    requiredLevel='2'
                                    difficulty='Medium'
                                    xpReward='150'
                                    role='Game Programmer'
                                    proficiencyReward='200'
                                />
                                <QuestCard
                                    questTitle='Membutuhkan aset dari main character'
                                    playerLevel='1'
                                    requiredLevel='3'
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
