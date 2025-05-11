import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Link, Divider } from '@mui/material';
import RoomServiceRoundedIcon from '@mui/icons-material/RoomServiceRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AdminQuestCard from '@/Components/AdminQuestCard';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Receptionist() {
    const { quests } = usePage().props;

    const [waitingQuests, setWaitingQuests] = useState([]);
    const [submittedQuests, setSubmittedQuests] = useState([]);
    const [ongoingQuests, setOngoingQuests] = useState([]);

    useEffect(() => {
        // Separate quests into waiting, submitted, and ongoing
        if (quests) {
            console.log("Received quests:", quests); // Debug log
            setWaitingQuests(quests.filter(quest => quest.status === 'waiting'));
            setSubmittedQuests(quests.filter(quest => quest.status === 'submitted'));
            setOngoingQuests(quests.filter(quest => quest.status === 'in progress'));
        }
    }, [quests]);

    return (
        <MainLayout>
            <Head title="Receptionist" />

            <Box>
                <div className="">
                    <div className="overflow-hidden">
                        <Box className="p-10 text-gray-900">

                            {/* Head */}
                            <Box>
                                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'flex-center' }}>
                                    <RoomServiceRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                                    Receptionist Table
                                </Typography>
                            </Box>
                            <Box sx={{ py: 1 }}>
                                <Typography>
                                    Manage quest requests and submissions from team members. Review, approve, or decline quests as needed.
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
                                <Box sx={{ mt: 1 }}>
                                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                        Project repo:
                                        <PrimaryButton
                                            href="https://github.com/F201/aselab-game-dev-open-project_001"
                                            target="_blank"
                                            size="small"
                                            sx={{ ml: 1, px: 2, py: 0.5 }}
                                            startIcon={
                                                <img
                                                    src="/images/github-mark-white.png"
                                                    alt="GitHub"
                                                    style={{ width: 16, height: 16 }}
                                                />
                                            }
                                        >
                                            Open Project
                                        </PrimaryButton>
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Pending Requests Section */}
                            <Box sx={{ py: 2 }}>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                                    Pending Requests
                                </Typography>

                                {waitingQuests && waitingQuests.length > 0 ? (
                                    waitingQuests.map((quest) => (
                                        <AdminQuestCard
                                            key={`request-${quest.quest_id}`}
                                            questId={quest.quest_id}
                                            questTitle={quest.title}
                                            questDescription={quest.description}
                                            difficulty={quest.difficulty}
                                            xpReward={quest.xp_reward}
                                            role={quest.role ?? 'Any'}
                                            proficiencyReward={quest.proficiency_reward ?? 0}
                                            status="waiting"
                                            requestDate={quest.request_date}
                                            issueLink={quest.issue_link}
                                            teammates={quest.teammates || []}
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
                                            No pending quest requests at the moment.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Divider sx={{ my: 4 }} />

                            {/* Pending Submissions Section */}
                            <Box sx={{ py: 2 }}>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                                    Pending Submissions
                                </Typography>

                                {submittedQuests && submittedQuests.length > 0 ? (
                                    submittedQuests.map((quest) => (
                                        <AdminQuestCard
                                            key={`submission-${quest.quest_id}`}
                                            questId={quest.quest_id}
                                            questTitle={quest.title}
                                            questDescription={quest.description}
                                            difficulty={quest.difficulty}
                                            xpReward={quest.xp_reward}
                                            role={quest.role ?? 'Any'}
                                            proficiencyReward={quest.proficiency_reward ?? 0}
                                            status="submitted"
                                            submitDate={quest.submit_date}
                                            submissionImages={quest.submission_images || []}
                                            issueLink={quest.issue_link}
                                            teammates={quest.teammates || []}
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
                                            No pending quest submissions at the moment.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Divider sx={{ my: 4 }} />

                            {/* Ongoing Quests Section */}
                            <Box sx={{ py: 2 }}>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                                    Ongoing Quests
                                </Typography>

                                {ongoingQuests && ongoingQuests.length > 0 ? (
                                    ongoingQuests.map((quest) => (
                                        <AdminQuestCard
                                            key={`ongoing-${quest.quest_id}`}
                                            questId={quest.quest_id}
                                            questTitle={quest.title}
                                            questDescription={quest.description}
                                            difficulty={quest.difficulty}
                                            xpReward={quest.xp_reward}
                                            role={quest.role ?? 'Any'}
                                            proficiencyReward={quest.proficiency_reward ?? 0}
                                            status="in progress"
                                            requestDate={quest.request_date}
                                            submitDate={quest.created_at}
                                            issueLink={quest.issue_link}
                                            teammates={quest.teammates || []}
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
                                            No ongoing quests at the moment.
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