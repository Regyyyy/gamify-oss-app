import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Link, Button, Divider } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    Popover,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    IconButton,
    Badge,
} from '@mui/material';

import MapRoundedIcon from '@mui/icons-material/MapRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import QuestCard from '@/Components/QuestCard';
import PrimaryButton from '@/Components/PrimaryButton';
import { useEffect, useState } from 'react';
import SecondaryButton from '@/Components/SecondaryButton';

export default function QuestBoard() {
    const { takenQuests, availableQuests, auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';

    // Filter state
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [difficultyFilter, setDifficultyFilter] = useState("None");
    const [roleFilter, setRoleFilter] = useState("None");
    const [filteredQuests, setFilteredQuests] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);

    // Filter popover handlers
    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    // Filter apply and reset handlers
    const applyFilters = () => {
        if (difficultyFilter !== "None" || roleFilter !== "None") {
            setIsFiltering(true);

            // Apply filtering logic
            let filtered = [...availableQuests];

            if (difficultyFilter !== "None") {
                filtered = filtered.filter(quest => quest.difficulty === difficultyFilter);
            }

            if (roleFilter !== "None") {
                filtered = filtered.filter(quest => {
                    // If the quest has no role (null), it won't match any role filter except "None"
                    return quest.role === roleFilter;
                });
            }

            setFilteredQuests(filtered);
        } else {
            setIsFiltering(false);
            setFilteredQuests([]);
        }

        handleFilterClose();
    };

    const resetFilters = () => {
        setDifficultyFilter("None");
        setRoleFilter("None");
        setIsFiltering(false);
        setFilteredQuests([]);
        handleFilterClose();
    };

    // Determine which quests to display
    const displayedQuests = isFiltering ? filteredQuests : availableQuests;

    useEffect(() => {
        // Log taken and available quests for debugging
        if (takenQuests) {
            console.log("Taken quests:", takenQuests);
        }
        if (availableQuests) {
            console.log("Available quests:", availableQuests);
        }
    }, [takenQuests, availableQuests]);

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
                                                isCompleted={quest.status === 'finished'}
                                                isTaken={true}
                                                submissionImages={quest.submission_images || []}
                                                issueLink={quest.issue_link}
                                                teammates={quest.teammates || []}
                                                questType="Advanced"
                                                currentUserAvatar={user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png'}
                                                status={quest.status}
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
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <IconButton
                                            onClick={handleFilterClick}
                                            sx={{ ml: 1 }}
                                            color={isFiltering ? "primary" : "default"}
                                            aria-label="filter quests"
                                        >
                                            <Badge
                                                color="primary"
                                                variant="dot"
                                                invisible={!isFiltering}
                                            >
                                                <FilterListIcon />
                                            </Badge>
                                        </IconButton>
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
                                </Box>

                                {/* Filter Popover */}
                                <Popover
                                    open={Boolean(filterAnchorEl)}
                                    anchorEl={filterAnchorEl}
                                    onClose={handleFilterClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <Box sx={{ p: 3, width: 300 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Filter Quests
                                        </Typography>

                                        {/* Difficulty Filter */}
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="difficulty-filter-label">Difficulty</InputLabel>
                                            <Select
                                                labelId="difficulty-filter-label"
                                                id="difficulty-filter"
                                                value={difficultyFilter}
                                                label="Difficulty"
                                                onChange={(e) => setDifficultyFilter(e.target.value)}
                                            >
                                                <MenuItem value="None">All Difficulties</MenuItem>
                                                <MenuItem value="Easy">Easy</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="Hard">Hard</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Role Filter */}
                                        <FormControl fullWidth sx={{ mb: 3 }}>
                                            <InputLabel id="role-filter-label">Role</InputLabel>
                                            <Select
                                                labelId="role-filter-label"
                                                id="role-filter"
                                                value={roleFilter}
                                                label="Role"
                                                onChange={(e) => setRoleFilter(e.target.value)}
                                            >
                                                <MenuItem value="None">All Roles</MenuItem>
                                                <MenuItem value="Game Designer">Game Designer</MenuItem>
                                                <MenuItem value="Game Artist">Game Artist</MenuItem>
                                                <MenuItem value="Game Programmer">Game Programmer</MenuItem>
                                                <MenuItem value="Audio Composer">Audio Composer</MenuItem>
                                            </Select>
                                        </FormControl>

                                        {/* Filter Actions */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <SecondaryButton
                                                onClick={resetFilters}
                                            >
                                                Reset
                                            </SecondaryButton>
                                            <PrimaryButton
                                                onClick={applyFilters}
                                            >
                                                Apply Filters
                                            </PrimaryButton>
                                        </Box>
                                    </Box>
                                </Popover>

                                {displayedQuests && displayedQuests.length > 0 ? (
                                    displayedQuests.map((quest) => (
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
                                        textAlign: 'center',
                                    }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {isFiltering
                                                ? "No quests match the selected filters."
                                                : "No available quests at the moment."}
                                            {isAdmin && !isFiltering && (
                                                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                                                    Click the "Add New Quest" button to create one.
                                                </Box>
                                            )}
                                        </Typography>
                                        {isFiltering && (
                                            <Box sx={{ mt: 2 }}>
                                                <SecondaryButton
                                                    onClick={resetFilters}
                                                >
                                                    Clear Filters
                                                </SecondaryButton>
                                            </Box>
                                        )}
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