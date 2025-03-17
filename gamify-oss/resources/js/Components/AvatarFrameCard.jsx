import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useTheme } from '@mui/material/styles';

export default function AvatarFrameCard({ 
    id, 
    name, 
    imagePath, 
    isUnlocked, 
    isSelected, 
    onSelect 
}) {
    const theme = useTheme();
    
    return (
        <Paper
            elevation={3}
            sx={{
                position: 'relative',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isUnlocked ? 'pointer' : 'default',
                opacity: isUnlocked ? 1 : 0.5,
                border: isSelected ? '2px solid' : '2px solid transparent',
                borderColor: isSelected ? theme.palette.primary.main : 'transparent',
                transition: 'all 0.2s',
                '&:hover': {
                    transform: isUnlocked ? 'translateY(-5px)' : 'none',
                    boxShadow: isUnlocked ? 6 : 3,
                },
                height: 200, // Fixed height
                width: 180,   // Fixed width
                mx: 'auto',   // Center in grid cell
            }}
            onClick={() => isUnlocked && onSelect(id)}
        >
            {!isUnlocked && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        zIndex: 1,
                    }}
                >
                    <LockIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
            )}
            
            <Box
                sx={{
                    width: 100,
                    height: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    mt: 1,
                }}
            >
                <img 
                    src={imagePath} 
                    alt={`${name} frame`} 
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        objectFit: 'contain',
                    }} 
                />
            </Box>
            
            <Box sx={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                flexGrow: 1,
            }}>
                <Typography 
                    variant="subtitle2" 
                    align="center" 
                    fontWeight="bold"
                    sx={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: '4.5em', // Approximately 3 lines
                    }}
                >
                    {name}
                </Typography>
            </Box>
        </Paper>
    );
}