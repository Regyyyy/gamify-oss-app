import React from 'react';
import { Avatar, Box, Tooltip } from '@mui/material';
import { Link } from '@inertiajs/react';

export default function AvatarProfile({
  src,
  alt = "User Avatar",
  userId,
  frameSrc = null,
  size = 40,
  frameSize = null,
  showTooltip = true,
  tooltipText = "View Profile",
  disabled = false,
  sx = {},
  frameSx = {},
  boxSx = {},
  ...props
}) {
  // Calculate frame size if not provided
  const calculatedFrameSize = frameSize || (size + 30);
  
  // Content with the avatar and optional frame
  const avatarContent = (
    <Box
      sx={{
        position: 'relative',
        width: calculatedFrameSize,
        height: calculatedFrameSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        ...boxSx
      }}
    >
      {/* Avatar */}
      <Avatar
        src={src}
        alt={alt}
        sx={{
          width: size,
          height: size,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          ...sx
        }}
        {...props}
      />
      
      {/* Optional frame */}
      {frameSrc && (
        <img
          src={frameSrc}
          alt="Avatar Frame"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 2,
            ...frameSx
          }}
        />
      )}
    </Box>
  );

  // If disabled, just return the content without link
  if (disabled || !userId) {
    return avatarContent;
  }

  // With tooltip and link
  return (
    <Tooltip title={showTooltip ? tooltipText : ""} arrow>
      <Link href={route('profile.show', userId)}>
        {avatarContent}
      </Link>
    </Tooltip>
  );
}