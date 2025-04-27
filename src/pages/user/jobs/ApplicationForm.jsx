import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Alert,
} from "@mui/material"
import { toast } from "react-hot-toast";
import { Upload, FileText, Check, AlertCircle } from "lucide-react"
import Multi from "../../../components/question/Multi";
import Boolean from "../../../components/question/Boolean";
import { createAnswer } from "../../../services/Answer";
import { userContext } from "../../../context/UserContext";
import { patchUser } from "../../../services/Auth";
import { patchApplication } from "../../../services/Application";
import { CloudUploadIcon } from "lucide-react";
import '../../../styles/theme.css';
import '../../../ComponentsStyles/application_form.css';
const ApplicationForm = ({ questions, answers: savedAnswers, application, refetch }) => {
  const location = useLocation();
  const { user, setUser, isLight } = useContext(userContext);
  const [answers, setAnswers] = useState(
    savedAnswers ? { ...savedAnswers } : {}
  );
  const [cv, setCv] = useState(user.cv || null);
  const [cvNew, setCvNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  // console.log("Questions data received:", questions);
  console.log("Saved Answers:", answers);
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

  const handleCvChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Cv File size must be less than 1MB");
        return;
      }
    }
    setCv(file);
    setCvNew(true);
  };

  // submit multi value
  const handleSubmit = async () => {
    try{
      setIsSubmitting(true)

      if (cvNew) {
        const cvForm = new FormData();
        if (!(cv instanceof File)) {
          console.error("cv is not a valid File object:", cv);
          setIsSubmitting(false)
          return;
      }
    cvForm.append("cv", cv, cv.name); 
    try {
        const cvRes = await patchUser(user.id, cvForm);
        if(!cvRes) {
          console.error("CV upload failed:", cvRes);
          setIsSubmitting(false)
          return;
        }
        setUser(cvRes)
        console.log("CV Upload Response:", cvRes);
        await patchApplication(application.id,{'status': '2'})
        refetch()
    } catch (error) {
        console.error("Error uploading CV:", error.response?.data || error);
        return;
    }
    }else if (user.cv) {
      await patchApplication(application.id,{'status': '2'})
      refetch()
    }
    if (Object.keys(answers).length > 0) {
      const output = Object.entries(answers).map(([key, value]) => ({
        answer_text: Array.isArray(value) ? JSON.stringify(value) : value,
        application: application.id,
        question: parseInt(key),
      }));
      const formData = { answers: output };
      const res = await createAnswer(formData);
      console.log("Submitted Answers:", res);
      setIsSubmitting(false)
    }} catch (error) {
      console.error("Error submitting answers:", error.response?.data || error);
      setIsSubmitting(false)
    }
  };


  const isFormDisabled =
  questions?.some((question) => question.required && typeof answers[question.id] === "undefined") ||
  !cv ||
  Number.parseInt(application.status) > 1 ||
  application.job_details.status === "0"


  return (

    <Container className="application-form-container">
    <Paper className="application-form-paper" style={{background: isLight ? '#fff' : '#242424'}}>
      <Typography variant="h4" className="form-title" style={{color: isLight ? '#242424' : '#fff'}}>
        Job Application
      </Typography>

      {application.fail ? (
        <Alert severity="error" className="application-alert">
          <AlertCircle size={20} className="alert-icon" />
          <Typography>Unfortunately, you have failed this phase</Typography>
        </Alert>
      ) : Number.parseInt(application?.status) > 1 ? (
        <>
          <Alert severity="success" className="application-alert">
            <Check size={20} className="alert-icon" />
            <Typography>Your application has been submitted successfully</Typography>
          </Alert>
          <Alert severity="info" className="application-alert">
            <Typography>Please check the next phases for updates</Typography>
          </Alert>
        </>
      ) : (
        <>
          <div className="questions-container">
            {questions?.map((question) => (
              <FormControl key={question.id} component="fieldset" className="question-control">
                <FormLabel className="question-label">
                  {question.text}
                  {question.required && <span className="required-mark">*</span>}
                </FormLabel>

                {question.type === "Single Choice" && (
                  <RadioGroup
                    onChange={(e) => handleChange(question.QuestionID, e.target.value)}
                    className="radio-group"
                  >
                    {question.options?.map((option, index) => (
                      <FormControlLabel
                        key={index}
                        value={option}
                        control={
                          <Radio
                            sx={{
                              color: "#722732",
                              "&.Mui-checked": {
                                color: "#722732",
                              },
                            }}
                          />
                        }
                        label={option}
                        className="radio-option"
                      />
                    ))}
                  </RadioGroup>
                )}

                {question.type === "multichoice" && (
                  <Multi
                    question={question}
                    handleMultiChange={handleMultiChange}
                    answer={savedAnswers}
                    value={answers}
                  />
                )}

                {question.type === "boolean" && (
                  <Boolean question={question} setValue={handleChange} answer={savedAnswers} value={answers} />
                )}
              </FormControl>
            ))}
          </div>

          <div className="cv-section">
            <FormControl className="cv-control">
              <FormLabel className="cv-label">
                CV Upload <span className="required-mark">*</span>
              </FormLabel>

              <div className="cv-options">
                {user?.cv && (
                  <a
                    href={user.cv.endsWith("pdf") ? user.cv : user.cv + ".pdf"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-cv-link"
                  >
                    <FileText size={18} className="cv-icon" />
                    <span>View Current CV</span>
                  </a>
                )}

                <div className="cv-upload-container">
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<Upload />}
                    className="upload-button"
                    sx={{
                      borderColor: "#722732",
                      color: "#722732",
                      "&:hover": {
                        borderColor: "#8c3642",
                        backgroundColor: "rgba(114, 39, 50, 0.04)",
                      },
                    }}
                  >
                    {cvNew ? "Change CV" : "Upload New CV"}
                    <input
                      type="file"
                      hidden
                      onChange={handleCvChange}
                      accept=".pdf,.doc,.docx"
                      disabled={Number.parseInt(application.status) > 1}
                    />
                  </Button>

                  {cvNew && (
                    <div className="file-info">
                      <span className="file-name">{cv.name}</span>
                      <Button size="small" variant="text" color="error" onClick={() => setCvNew(false)}>
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </FormControl>
          </div>

          <Button
            variant="contained"
            className="submit-button"
            onClick={handleSubmit}
            disabled={isFormDisabled || isSubmitting}
            sx={{
              backgroundColor: "#722732",
              "&:hover": {
                backgroundColor: "#8c3642",
              },
              "&:disabled": {
                backgroundColor: "#e9d8d9",
              },
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </>
      )}
    </Paper>
  </Container>




    // <Container
    //   sx={{
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     flexDirection: "column",
    //   }}
    // >
    //   <Typography variant="h4" gutterBottom>
    //     Job Application Questions
    //   </Typography>
    //   {application.fail ? <Typography color="red" variant="h6" gutterBottom>
    //     Unfortunately you have failed this phase
    //   </Typography> : parseInt(application?.status) > 1 ? <><Typography color="green" variant="h6" gutterBottom>
    //     Your application is submitted
    //   </Typography>
    //   <Typography color="green" variant="h6" gutterBottom>
    //     Check the next phases
    //   </Typography>
    //   </> : (<>
    //   {questions?.map((question) => (
    //     <FormControl
    //       key={question.id}
    //       component="fieldset"
    //       margin="normal"
    //       fullWidth
    //     >
    //       <FormLabel>
    //         {question.text}
    //         {question.required && <span style={{ color: "red" }}> *</span>}
    //       </FormLabel>

    //       {question.type === "Single Choice" && (
    //         <RadioGroup
    //           onChange={(e) =>
    //             handleChange(question.QuestionID, e.target.value)
    //           }
    //         >
    //           {question.options?.map((option, index) => (
    //             <FormControlLabel
    //               key={index}
    //               value={option}
    //               control={<Radio />}
    //               label={option}
    //             />
    //           ))}
    //         </RadioGroup>
    //       )}

    //       {question.type === "multichoice" && (
    //         <Multi
    //           question={question}
    //           handleMultiChange={handleMultiChange}
    //           answer={savedAnswers}
    //           value={answers}
    //         />
    //       )}
    //       {question.type === "boolean" && (
    //         <Boolean
    //           question={question}
    //           setValue={handleChange}
    //           answer={savedAnswers}
    //           value={answers}
    //         />
    //       )}
    //     </FormControl>
    //   ))}

    //   <FormControl>
    //     <FormLabel>
    //       Apply with Old CV or Upload New One
    //     </FormLabel>
    //     {user?.cv && (
    //         <a
    //           href={user.cv.endsWith("pdf") ? user.cv : user.cv + ".pdf"}
    //           target="_blank"
    //           style={{
    //             textDecoration: "underline",
    //             cursor: "pointer",
    //           }}
    //         >
    //           View Old CV
    //         </a>
    //       )}
    //     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    //       <div
    //         style={{
    //           border: "1px solid #ccc",
    //           borderRadius: "5px",
    //           padding: "5px",
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //           cursor: "pointer",
    //         }}
    //         onClick={() => handleCvChange({ target: { files: [] } })}
    //         disabled={application.status == '2'}
    //       >
    //         <CloudUploadIcon style={{ marginRight: "10px" }} />
    //         <Typography variant="body2">Upload New CV</Typography>
    //       </div>
    //       {cvNew && (
    //         <button
    //           className="btn btn-danger p-0 px-1"
    //           style={{ borderRadius: "5px", padding: "5px" }}
    //           onClick={() => setCvNew(false)}
    //         >
    //           X
    //         </button>
    //       )}
    //     </div>
    //   </FormControl>

    //   <Button
    //     variant="contained"
    //     color="primary"
    //     sx={{ mt: 3 }}
    //     onClick={handleSubmit}
    //     disabled={
    //       questions?.some(
    //         (question) =>
    //           question.required && typeof answers[question.id] === "undefined"
    //       ) || !cv || parseInt(application.status) > 1 || application.job_details.status == '0'
    //     }
    //   >
    //     Submit
    //   </Button></>)}
    // </Container>
  );
};

export default ApplicationForm;
