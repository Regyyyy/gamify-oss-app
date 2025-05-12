import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateUserAvatarFrameForm from './Partials/UpdateUserAvatarFrameForm';
import SettingsLayout from '@/Layouts/SettingsLayout';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

export default function Edit({ mustVerifyEmail, status }) {
    const theme = useTheme();
    
    return (
        <SettingsLayout>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Back to Quest Board link - added at the top */}
                    <Box sx={{ mb: 2 }}>
                        <Link 
                            href={route('questboard')} 
                            style={{ textDecoration: 'none' }}
                        >
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    color: 'text.secondary',
                                    '&:hover': { 
                                        color: theme.palette.primary.main,
                                    },
                                    transition: 'color 0.2s'
                                }}
                            >
                                <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Back to Quest Board
                            </Typography>
                        </Link>
                    </Box>
                    
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateUserAvatarFrameForm className="max-w-xl" />
                    </div>
                    {/*
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                    */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </SettingsLayout>
    );
}