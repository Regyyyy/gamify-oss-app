import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Box, Typography, Alert, Button } from '@mui/material';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import AddIcon from '@mui/icons-material/Add';
import BadgeCard from '@/Components/BadgeCard';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Badges() {
    const { badges } = usePage().props;
    const { user } = usePage().props.auth;
    const isAdmin = user.role === 'admin';

    const sortedBadges = badges ? [...badges].sort((a, b) => {
        if (a.is_unlocked !== b.is_unlocked) {
            return a.is_unlocked ? -1 : 1;
        }
        return a.id - b.id;
    }) : [];

    return (
        <MainLayout>
            <Head title="Badges" />
            <Box className="p-10 text-gray-900">
                {/* Header */}
                <Typography variant='h4' sx={{ display: 'flex', fontWeight: 'bold', alignItems: 'center' }}>
                    <EmojiEventsRoundedIcon sx={{ fontSize: 38, mr: 1 }} />
                    Badges
                </Typography>
                <Typography sx={{ py: 1 }}>
                    Earn special badges by completing various activities in the project! They'll be added to your profile once verified by an admin.
                </Typography>

                {/* Badges List - Sorted (Unlocked First, then by ID) */}
                {/* Badges List - Sorted (Unlocked First, then by ID) */}
                <Box className="pt-5">
                    {isAdmin && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <PrimaryButton
                                startIcon={<AddIcon />}
                                href={route('admin.badges.award')}
                            >
                                Award Badge
                            </PrimaryButton>
                        </Box>
                    )}
                    {sortedBadges.map((badge) => (
                        <BadgeCard
                            key={badge.id}
                            badgeName={badge.name}
                            badgeDescription={badge.description}
                            imagePath={badge.image_path}
                            isUnlocked={badge.is_unlocked}
                        />
                    ))}
                </Box>

                {/* Empty State */}
                {(!badges || badges.length === 0) && (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                        <Typography variant="h6" color="text.secondary">
                            No badges available yet.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Check back later for new badges to earn!
                        </Typography>
                    </Box>
                )}
            </Box>
        </MainLayout>
    );
}