import * as React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "@/auth/AuthProvider";

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" sx={{ mb: 1 }}>
                    Profile
                </Typography>
                <Typography variant="body1">Username: {user?.userName ?? "-"}</Typography>
            </CardContent>
        </Card>
    );
}
