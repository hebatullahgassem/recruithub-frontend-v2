import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
import { Container, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, TextField, Button } from "@mui/material";
const ApplicationForm = ({ questions: propQuestions = [] }) => {
    const location = useLocation();
    const [questions, setQuestions] = useState(propQuestions.length ? propQuestions : location.state?.questions || []);
    const [answers, setAnswers] = useState({});
    console.log("Questions data received:", questions);

    useEffect(() => {
        if (!propQuestions && location.state?.questions) {
            setQuestions(location.state.questions);
        }
    }, [propQuestions, location.state]);

    const handleChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
      };
    
    const handleMultiChange = (questionId, option) => {
        setAnswers((prev) => {
            const currentAnswers = prev[questionId] || [];
            return {
                ...prev,
                [questionId]: currentAnswers.includes(option)
                    ? currentAnswers.filter((item) => item !== option)
                    : [...currentAnswers, option],
            };
        });
    };

    
    const handleSubmit = () => {
        console.log("Submitted Answers:", answers);
        alert("Your application has been submitted!");
    };

    if (!questions.length) return <p>Loading questions...</p>;
    
      return (
        <Container>
        <Typography variant="h4" gutterBottom>Job Application Quiz</Typography>
        {questions.map((question) => (
            <FormControl key={question.QuestionID} component="fieldset" margin="normal" fullWidth>
                <FormLabel>{question.Text}</FormLabel>

                {question.Type === "Text" && (
                    <TextField
                        fullWidth
                        variant="outlined"
                        onChange={(e) => handleChange(question.QuestionID, e.target.value)}
                    />
                )}

                {question.Type === "Single Choice" && (
                    <RadioGroup onChange={(e) => handleChange(question.QuestionID, e.target.value)}>
                        {question.options?.map((option, index) => (
                            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                        ))}
                    </RadioGroup>
                )}

                {question.Type === "Multiple Choice" && (
                    question.options?.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    onChange={() => handleMultiChange(question.QuestionID, option)}
                                />
                            }
                            label={option}
                        />
                    ))
                )}
            </FormControl>
        ))}

        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSubmit}>
            Submit
        </Button>
    </Container>
    );
};

export default ApplicationForm;