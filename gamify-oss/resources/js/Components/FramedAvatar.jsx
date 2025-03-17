import React from 'react';
import { Box, Avatar } from '@mui/material';

export default function FramedAvatar({
    avatarSrc,
    frameSrc,
    alt = 'User Avatar',
    size = 200,
}) {
    return (
        <Box>
            <Box
                sx={{
                    position: 'relative',
                    width: size,
                    height: size,
                }}
            >
                {/* Avatar */}
                <Avatar
                    src={avatarSrc}
                    alt={alt}
                    sx={{
                        width: size - 30,
                        height: size - 30,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />

                {/* Frame overlay */}
                {frameSrc && (
                    <Box
                        component="img"
                        src={frameSrc}
                        alt="Avatar Frame"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}