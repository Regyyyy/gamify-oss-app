import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { yellow, blue, grey } from "@mui/material/colors";
import PrimaryButton from "@/Components/PrimaryButton";

export default function AchievementCard({
    achievementName = "Achievement Title",
    achievementDescription = "Achievement description goes here. This text will be truncated if it's too long.",
    xpReward = 100,
    extraReward = false,
    extraRewardName = null,
    isCompleted = false,
    isClaimed = false,
    onClaimReward = () => {},
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
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box>
                            {/* Achievement Info */}
                            <Typography variant="h6" fontWeight="bold">
                                {achievementName}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 2,
                                    overflow: "hidden",
                                }}
                            >
                                {achievementDescription}
                            </Typography>
                        </Box>

                        {/* Rewards */}
                        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                            <Chip
                                label={`XP +${xpReward}`}
                                sx={{
                                    bgcolor: yellow[200],
                                    border: "1px solid" + yellow[800],
                                    fontWeight: "bold",
                                }}
                            />
                            {extraReward && (
                                <Chip
                                    label={extraRewardName ? `Avatar Frame "${extraRewardName}"` : "Avatar Frame"}
                                    sx={{
                                        bgcolor: blue[200],
                                        border: "1px solid" + blue[800],
                                        fontWeight: "bold",
                                    }}
                                />
                            )}
                        </Box>
                    </Box>

                    {/* Status at the Bottom Right */}
                    <Box
                        sx={{
                            mt: "auto",
                            display: "flex",
                            justifyContent: "flex-end"
                        }}
                    >
                        {!isCompleted ? (
                            <Typography color={grey[600]} fontWeight="bold">
                                Not Completed
                            </Typography>
                        ) : isClaimed ? (
                            <Typography color={grey[600]} fontWeight="bold">
                                Completed
                            </Typography>
                        ) : (
                            <PrimaryButton onClick={onClaimReward}>
                                Claim Reward
                            </PrimaryButton>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}