import * as React from "react";
import { Box, Button, Card, CardContent, Chip, Grid, Typography } from "@mui/material";

const calendarDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HomePage() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Daily Completion</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 700, my: 2 }}>
                            100%
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Great work! You completed all planned activities for today.
                        </Typography>
                        <Button variant="contained">View details</Button>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Calendar · September 2026
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 1 }}>
                            {calendarDays.map((day) => (
                                <Typography key={day} variant="caption" color="text.secondary">
                                    {day}
                                </Typography>
                            ))}
                            {Array.from({ length: 35 }).map((_, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        height: 28,
                                        borderRadius: 1,
                                        backgroundColor: idx === 16 ? "primary.main" : "grey.100",
                                        color: idx === 16 ? "white" : "text.primary",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 12,
                                    }}
                                >
                                    {idx + 1 <= 30 ? idx + 1 : ""}
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Summary
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                            <Chip label="Hydration: Good" color="success" />
                            <Chip label="Sleep: Stable" color="primary" />
                            <Chip label="Stress: Medium" color="warning" />
                            <Chip label="Activity: High" color="success" />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Recommendation & Appointment
                        </Typography>
                        <Typography sx={{ mb: 2 }}>
                            Continue your current care plan and keep daily hydration above 2L.
                        </Typography>
                        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: "grey.100" }}>
                            <Typography variant="subtitle2">Next Appointment</Typography>
                            <Typography variant="body2">Dr. Simmons · 11:30 AM · 24 Sep</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
