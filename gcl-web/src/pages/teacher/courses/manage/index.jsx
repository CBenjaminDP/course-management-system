import React, {useState} from "react";
import {Box, Typography, Container, Tab, Tabs} from "@mui/material";
import DashboardLayout from "@/layouts/DashboardLayout";
import MyCourses from "@/components/Teacher/Assignments/Mycourses";

const CoursesManagement = () => {
    const [selectedTab, setSelectedTab] = useState("courses");

    const handleTabChange = (_, newValue) => {
        setSelectedTab(newValue);
    };

    return (
        <DashboardLayout>
            <Container maxWidth="lg">
                <Box sx={{py: 0}}>
                    <Typography variant="h4" gutterBottom>
                        Gestión de Cursos
                    </Typography>
                    <Box sx={{mt: 0}}>
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            sx={{borderBottom: 1, borderColor: "divider"}}
                        >
                            <Tab label="Mis Cursos" value="courses"/>
                        </Tabs>
                        <Box sx={{pt: 0}}>
                            {selectedTab === "courses" && <MyCourses/>}
                        </Box>
                    </Box>
                </Box>
            </Container>
        </DashboardLayout>
    );
}

export default CoursesManagement;