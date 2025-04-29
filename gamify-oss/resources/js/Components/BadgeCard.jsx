import React from "react";
import { Card, CardContent, Typography, Box, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { grey } from "@mui/material/colors";

export default function BadgeCard({
    badgeName = "Badge Title",
    badgeDescription = "Badge description goes here. This text will be truncated if it's too long.",
    imagePath = "",
    isUnlocked = false,
}) {
    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
                my: 2,
                px: 1,
                position: "relative",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                },
                opacity: isUnlocked ? 1 : 0.7,
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3
                }}>
                    {/* Badge Image */}
                    <Box sx={{
                        position: 'relative',
                        width: 200,
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 1
                    }}>
                        <img
                            src={imagePath}
                            alt={badgeName}
                            style={{
                                width: '90%',
                                height: '90%',
                                objectFit: 'contain',
                            }}
                        />

                        {/* Lock Overlay for Locked Badges */}
                        {!isUnlocked && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    borderRadius: '50%',
                                    zIndex: 1,
                                }}
                            >
                                <LockIcon sx={{ color: 'white', fontSize: 32 }} />
                            </Box>
                        )}
                    </Box>

                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Badge Info */}
                        <Typography variant="h6" fontWeight="bold">
                            {badgeName}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 3,
                                overflow: "hidden",
                            }}
                        >
                            {badgeDescription}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}