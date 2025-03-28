import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; 
import { Container, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, TextField, Button } from "@mui/material";
import Multi from '../../../components/question/Multi';
import Boolean from '../../../components/question/Boolean';
const ApplicationForm = ({ questions, answers:savedAnswers}) => {
    const location = useLocation();
    const [answers, setAnswers] = useState({});
    console.log("Questions data received:", questions);
    // const savedQuestionIds = Object.keys(savedAnswers).map(questionId => Number(questionId));
    // console.log("Saved Question IDs:", savedQuestionIds);


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
    };

    // if (!questions.length) return <p>Loading questions...</p>;
    
      return (
        <Container>
        <Typography variant="h4" gutterBottom>Job Application Quiz</Typography>
        {questions?.map((question) => (
            <FormControl key={question.id} component="fieldset" margin="normal" fullWidth>
                <FormLabel>{question.text}</FormLabel>

                {question.type === "Single Choice" && (
                    <RadioGroup onChange={(e) => handleChange(question.QuestionID, e.target.value)}>
                        {question.options?.map((option, index) => (
                            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                        ))}
                    </RadioGroup>
                )}

                {question.type === "multichoice" && (
                    <Multi question={question} handleMultiChange={handleMultiChange} answer={savedAnswers}/>
                )}
                {question.type === "boolean" && (
                    <Boolean question={question} setValue={handleChange} answer={savedAnswers}/>
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
