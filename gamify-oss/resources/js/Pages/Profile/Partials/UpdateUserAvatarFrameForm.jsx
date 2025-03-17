import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PrimaryButton from '@/Components/PrimaryButton';
import AvatarFrameCard from '@/Components/AvatarFrameCard';
import FramedAvatar from '@/Components/FramedAvatar';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

export default function UpdateUserAvatarFrameForm({ className = '' }) {
    const user = usePage().props.auth.user;
    const avatarSrc = user.avatar ? `/storage/${user.avatar}` : '/default-avatar.png';
    
    const [frames, setFrames] = useState([]);
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    
    // Fetch avatar frames on component mount
    useEffect(() => {
        const fetchFrames = async () => {
            try {
                const response = await axios.get(route('avatar-frames.index'));
                setFrames(response.data.frames);
                
                // Set initially selected frame
                const usedFrame = response.data.frames.find(frame => frame.is_used);
                if (usedFrame) {
                    setSelectedFrame(usedFrame.id);
                } else {
                    setSelectedFrame(1); // Default frame
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching avatar frames:', error);
                setMessage({
                    type: 'error',
                    text: 'Failed to load avatar frames. Please try again.'
                });
                setLoading(false);
            }
        };
        
        fetchFrames();
    }, []);
    
    // Handle frame selection
    const handleSelectFrame = (frameId) => {
        setSelectedFrame(frameId);
    };
    
    // Handle save button click
    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(route('avatar-frames.update'), {
                frame_id: selectedFrame,
            });
            
            // Update the local state to reflect changes
            setFrames(prevFrames => prevFrames.map(frame => ({
                ...frame,
                is_used: frame.id === selectedFrame
            })));
            
            setMessage({
                type: 'success',
                text: 'Avatar frame updated successfully!'
            });
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
            
            setSaving(false);
        } catch (error) {
            console.error('Error updating avatar frame:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to update avatar frame. Please try again.'
            });
            setSaving(false);
        }
    };
    
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Avatar Frame
                </h2>
                
                <p className="mt-1 text-sm text-gray-600">
                    Choose an avatar frame to personalize your profile. Unlock more frames by completing achievements.
                </p>
            </header>
            
            {message && (
                <Alert 
                    severity={message.type} 
                    sx={{ mt: 2, mb: 2 }}
                    onClose={() => setMessage(null)}
                >
                    {message.text}
                </Alert>
            )}
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {/* Avatar Preview with Selected Frame */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 4 }}>
                        <FramedAvatar
                            avatarSrc={avatarSrc}
                            frameSrc={selectedFrame ? frames.find(f => f.id === selectedFrame)?.image_path : null}
                        />
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {frames.map((frame) => (
                            <Grid item xs={6} sm={4} md={3} key={frame.id}>
                                <AvatarFrameCard
                                    id={frame.id}
                                    name={frame.name}
                                    imagePath={frame.image_path}
                                    isUnlocked={frame.is_unlocked}
                                    isSelected={selectedFrame === frame.id}
                                    onSelect={handleSelectFrame}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                        <PrimaryButton
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </PrimaryButton>
                    </Box>
                </>
            )}
        </section>
    );
}