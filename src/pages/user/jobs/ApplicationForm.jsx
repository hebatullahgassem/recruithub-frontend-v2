import React, { useState, useEffect, use } from 'react';
import { useLocation } from 'react-router-dom'; 
import { Container, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, TextField, Button } from "@mui/material";
import Multi from '../../../components/question/Multi';
import Boolean from '../../../components/question/Boolean';
import { createAnswer } from '../../../services/Answer';
const ApplicationForm = ({ questions, answers:savedAnswers, application}) => {
    const location = useLocation();
    const [answers, setAnswers] = useState(savedAnswers ? { ...savedAnswers } : {});

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



    // submit multi value
    const handleSubmit = async () => {
        const output = Object.entries(answers).map(([key, value]) => ({
            answer_text: Array.isArray(value) ? JSON.stringify(value) : value,
            application: application,
            question: parseInt(key)
        }));
        const res = await createAnswer(output[1]);
        console.log("Submitted Answers:", res);
    };

    // useEffect(() => {
    //     console.log(answers);
    // }, [answers])

    // if (!questions.length) return <p>Loading questions...</p>;
    
      return (
        <Container sx={{display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
        <Typography variant="h4" gutterBottom>Job Application Quiz</Typography>
        {questions?.map((question) => (
            <FormControl key={question.id} component="fieldset" margin="normal" fullWidth>
                <FormLabel>
                    {question.text}
                    {question.required && <span style={{color: 'red'}}> *</span>}
                </FormLabel>

                {question.type === "Single Choice" && (
                    <RadioGroup onChange={(e) => handleChange(question.QuestionID, e.target.value)}>
                        {question.options?.map((option, index) => (
                            <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                        ))}
                    </RadioGroup>
                )}

                {question.type === "multichoice" && (
                    <Multi question={question} handleMultiChange={handleMultiChange} answer={savedAnswers} value={answers}/>
                )}
                {question.type === "boolean" && (
                    <Boolean question={question} setValue={handleChange} answer={savedAnswers} value={answers}/>
                )}
            </FormControl>
        ))}

        <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
            disabled={questions?.some((question) => question.required && typeof answers[question.id] === 'undefined')}
        >
            Submit
        </Button>
    </Container>
    );
};

export default ApplicationForm;
