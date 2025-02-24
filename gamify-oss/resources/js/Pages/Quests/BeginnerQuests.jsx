import MainLayout from '@/Layouts/MainLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { Box, Typography, Link } from '@mui/material';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QuestCard from '@/Components/QuestCard';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';
import AdminLayout from '@/Layouts/AdminLayout';

export default function BeginnerQuest() {
    return (
        <AdminLayout
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
                                    questTitle='Membuka repository project dan baca README'
                                    playerLevel='1'
                                    requiredLevel='1'
                                    difficulty='Easy'
                                    xpReward='75'
                                    role='Game Designer'
                                    proficiencyReward='0'
                                />
                                <QuestCard
                                    questTitle='Memberi komentar kepada 3 issues yang berbeda'
                                    playerLevel='1'
                                    requiredLevel='1'
                                    difficulty='Easy'
                                    xpReward='150'
                                    role='Game Programmer'
                                    proficiencyReward='0'
                                />
                                <QuestCard
                                    questTitle='Membuat fork dari project repository'
                                    playerLevel='1'
                                    requiredLevel='1'
                                    difficulty='Easy'
                                    xpReward='75'
                                    role='Game Artist'
                                    proficiencyReward='0'
                                />
                                <QuestCard
                                    questTitle='Melakukan pull request kepada project repository'
                                    playerLevel='1'
                                    requiredLevel='2'
                                    difficulty='Medium'
                                    xpReward='150'
                                    role='Game Artist'
                                    proficiencyReward='0'
                                />
                                <QuestCard
                                    questTitle='Membuat issue baru terkait ide/masukan/temuan pada project'
                                    playerLevel='1'
                                    requiredLevel='2'
                                    difficulty='Medium'
                                    xpReward='150'
                                    role='Game Artist'
                                    proficiencyReward='0'
                                />
                            </Box>
                        </Box>
                    </div>
                </div>
            </Box>
        </AdminLayout>
    );
}
