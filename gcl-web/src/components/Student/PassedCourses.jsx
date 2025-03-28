import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const PassedCourses = ({ courses = [] }) => {
  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Passed Courses
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="passed courses table">
          <TableHead>
            <TableRow>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell align="right">Credits</TableCell>
              <TableCell align="right">Final Grade</TableCell>
              <TableCell>Completion Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {course.code}
                </TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell align="right">{course.credits}</TableCell>
                <TableCell align="right">{course.finalGrade}</TableCell>
                <TableCell>{course.completionDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PassedCourses;
