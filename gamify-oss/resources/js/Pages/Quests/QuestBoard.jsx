import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Link, Button, Divider } from '@mui/material';

import MapRoundedIcon from '@mui/icons-material/MapRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import QuestCard from '@/Components/QuestCard';
import PrimaryButton from '@/Components/PrimaryButton';

export default function QuestBoard() {
    const { takenQuests, availableQuests, auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';
    
    return (
        <MainLayout>
            <Head title="QuestBoard" />

            <Box>
                <div className="">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
                            <Box>
                                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                                    <MapRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Quest Board
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                    Choose quest you want to take! You can collaborate with teammates on Advanced quests.
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

                            {/* Your Taken Quests Section - Only shown if user has taken quests */}
                            {takenQuests && takenQuests.length > 0 && (
                                <>
                                    <Box sx={{ py: 2 }}>
                                        <Typography variant="h5" fontWeight="bold" sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <AssignmentTurnedInIcon sx={{ fontSize: 28, mr: 1 }} />
                                            Your Taken Quests
                                        </Typography>
                                        
                                        {takenQuests.map((quest) => (
                                            <QuestCard
                                                key={`taken-${quest.quest_id}`}
                                                questId={quest.quest_id}
                                                questTitle={quest.title}
                                                questDescription={quest.description}
                                                playerLevel={user.level.toString()}
                                                requiredLevel={quest.difficulty === "Hard" ? 4 : 3}
                                                difficulty={quest.difficulty}
                                                xpReward={quest.xp_reward}
                                                role={quest.role ?? 'Any'}
                                                proficiencyReward={quest.proficiency_reward ?? 0}
                                                isCompleted={quest.is_completed || false}
                                                isTaken={true}
                                                submissionImages={quest.submission_images || []}
                                                issueLink={quest.issue_link}
                                                teammates={quest.teammates || []}
                                                questType="Advanced"
                                                currentUserAvatar={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                            />
                                        ))}
                                    </Box>

                                    <Divider sx={{ my: 4 }} />
                                </>
                            )}

                            {/* Available Quests Section */}
                            <Box sx={{ py: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5" fontWeight="bold">
                                        Available Quests
                                    </Typography>
                                    {isAdmin && (
                                        <PrimaryButton 
                                            variant="contained" 
                                            startIcon={<AddIcon />}
                                            href={route('quests.create')}
                                        >
                                            Add New Quest
                                        </PrimaryButton>
                                    )}
                                </Box>
                                
                                {availableQuests && availableQuests.length > 0 ? (
                                    availableQuests.map((quest) => (
                                        <QuestCard
                                            key={`available-${quest.quest_id}`}
                                            questId={quest.quest_id}
                                            questTitle={quest.title}
                                            questDescription={quest.description}
                                            playerLevel={user.level.toString()}
                                            requiredLevel={quest.difficulty === "Hard" ? 4 : 3}
                                            difficulty={quest.difficulty}
                                            xpReward={quest.xp_reward}
                                            role={quest.role ?? 'Any'}
                                            proficiencyReward={quest.proficiency_reward ?? 0}
                                            isCompleted={false}
                                            isTaken={false}
                                            issueLink={quest.issue_link}
                                            questType="Advanced"
                                            currentUserAvatar={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                            status={quest.status}
                                        />
                                    ))
                                ) : (
                                    <Box sx={{ 
                                        p: 4, 
                                        border: '1px dashed #ccc', 
                                        borderRadius: 2, 
                                        textAlign: 'center' 
                                    }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No available quests at the moment.
                                            {isAdmin && (
                                                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                                    Click the "Add New Quest" button to create one.
                                                </Box>
                                            )}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </div>
                </div>
            </Box>
        </MainLayout>
    );
}