import React, { useEffect, useState, useRef } from 'react';
import { useParams , useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ProcessColumn from "../../../components/companyProcess/ProcessColumn";
import JobDetails from '../../../components/job/JobDetails';
import { Box,Button } from "@mui/material";
import ApplicationForm from './ApplicationForm';
// import PhasesSwitcher from '../../../components/job/PhasesSwitcher';
import Meeting from '../../../components/job/user/Meeting';
import { useQuery } from '@tanstack/react-query';
import { getApplicationsByUser } from '../../../services/Application';
const UserSingleJob = () => {
    const { jobId } = useParams(); 
    const navigate = useNavigate();
    const [userJob, setUserJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clickedColumn, setClickedColumn] = useState(1);
    // const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [page, setPage] = useState(1);
      const [pageSize, setPageSize] = useState(10);
      const [total, setTotal] = useState(0);
      
      const [filters, setFilters] = useState({
        user: "",
        job: "",
      });
    
      const [searchFilters, setSearchFilters] = useState({
        user: "7",
        job: `${jobId}`,
      });


    const formRef = useRef(null);
  
    const phases = ["Application", "Technical Assessment", "Technical Interview", "Hr Interview","Offer"];
   
    const data2={
        "user": {
          "UserID": 1,
          "Name": "Alice Johnson",
          "DOB": "1995-05-20",
          "Education": "Bachelor's in Computer Science",
          "Experience": "3 years as a Software Engineer",
          "CV": "https://example.com/cv/alice_johnson.pdf",
          "Img": "https://example.com/images/alice.jpg",
          "Location": "New York, USA",
          "NatID": "A1234567",
          "Keywords": "Python, Django, REST API"
        },
        "job": {
          "JobID": 1,
          "Title": "Software Engineer",
          "Description": "Develop and maintain web applications.",
          "Keywords": "Python, Django, React, JavaScript",
          "Status": "Open",
          "Company": {
            "CompanyID": 1,
            "Name": "Tech Corp",
            "Est": "2010-06-15",
            "Location": "San Francisco, USA",
            "Industry": "Technology"
          }
        },
        "application": {
          "UserJobID": 10,
          "Status": 3,
          "AssessmentLink": "https://example.com/assessment/123",
          "AssessmentTime": "2024-03-10T09:00:00.000Z",
          "AssessmentRes": "",
          "InterviewLink": "https://example.com/interview/123",
          "InterviewTime": "2024-03-15T14:00:00.000Z",
          "HrLink": "https://example.com/hr/123",
          "HrTime": "2024-03-22T10:00:00.000Z"
        },
        "questions": [
          {
            "QuestionID": 1,
            "Text": "What programming languages are you proficient in?",
            "Type": "Text"
          },
          {
            "QuestionID": 2,
            "Text": "What is the time complexity of a binary search?",
            "Type": "Single Choice"
          },
          {
            "QuestionID": 3,
            "Text": "Which of the following are frontend frameworks?",
            "Type": "Multiple Choice"
          }
        ],
        "answers": [
          {
            "UserJobQuestionID": 1,
            "QuestionID": 1,
            "Answer": "Python, JavaScript, C++",
            "Result": "Passed"
          },
          {
            "UserJobQuestionID": 2,
            "QuestionID": 2,
            "Answer": "O(log n)",
            "Result": "Correct"
          }
        ]
      }
      

      const questions = [
        { 
            "QuestionID": 1, 
            "Text": "What is the time complexity of a binary search?", 
            "Type": "Single Choice",
            "options": ["O(n)", "O(log n)", "O(1)"] 
        },
        { 
            "QuestionID": 2, 
            "Text": "Which of the following are frontend frameworks?", 
            "Type": "Multiple Choice",
            "options": ["React", "Angular", "Django", "Vue"] ,
            
        }
    ];

    const {
      data: userApp,
      error: userAppError,
      isLoading: userAppLoading,
      refetch,
    } = useQuery({
      queryKey: ["userApp", page, pageSize, searchFilters],
      queryFn: async () => {
        // console.log({ filters: searchFilters, page, pageSize })
        const res = await getApplicationsByUser({ filters: searchFilters, page, pageSize });
        console.log(res)
        setTotal(res.count);
        return res.results[0];
      },
    });
    // console.log(userApp)

    useEffect(() => {
        const fetchUserJob = async () => {
            try {
                // Fetch user-job details (Replace with actual API endpoint)
                const response = await axios.get(`/api/user-jobs/${jobId}`);
                setUserJob(response.data);
            } catch (err) {
                setError('Failed to fetch job application details.');
            } finally {
                setLoading(false); // Ensure loading is false after fetching
            }
        };

        fetchUserJob();
    }, [jobId]);

  
    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;
   


    return (
        <div className="container mt-5">

            <JobDetails job={userApp?.job_details}/>
            <ProcessColumn setter={setClickedColumn} column={clickedColumn} phases={phases}/>
            {clickedColumn === 1 && <ApplicationForm questions={userApp?.job_details?.questions} answers={userApp?.answers} application={userApp?.id}/>}
            {/* <button onClick={showApplication}>Apply</button> */}
            {clickedColumn > 1 && <Meeting phase={phases[clickedColumn-1]} applicationData ={data2.application}  clickedColumn={clickedColumn}/>}

            {/* <PhasesSwitcher phase={clickedColumn} questions={questions} /> */}
     </div>
    );
};


export default UserSingleJob;
