import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { userContext } from "../../context/UserContext";
import { useNavigate } from "react-router";
import { Box } from "@mui/material";
const Home = () => {
  const { user, refetchUser, token, isLight } = useContext(userContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      // If no user is logged in, redirect to login page
      navigate("/login");
    } else if (user.user_type === "JOBSEEKER") {
      navigate("/applicant/jobs");
    } else if (user.user_type === "COMPANY") {
      navigate("/company/jobs");
    } else if (user.user_type === "ADMIN") {
      navigate("/admin/itians");
    } else {
      navigate("/login");
    }
  };

  const isJobSeeker = user && user.user_type === "JOBSEEKER";
  const isCompany = user && user.user_type === "COMPANY";
  const isAdmin = user && user.user_type === "ADMIN";

  useEffect(() => {
    refetchUser();
  }, [token]);

  return (
    <Container
      fluid
      className="p-0"
      style={{ backgroundColor: isLight ? "#ffffff" : "#1c0000" }}
    >
      {/* Hero Section */}
      <Row
        className="hero-section mx-auto"
        style={{
          minHeight: "100vh",
          // backgroundImage:
          //   "url('https://knowledgecity.iti.gov.eg/assets/images/slider/Web%20capture_18-1-2023_4417_.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#901b20",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          // padding: "20px",
          maxWidth: "100vw",
        }}
      >
        <img
          src="https://knowledgecity.iti.gov.eg/assets/images/slider/Web%20capture_18-1-2023_4417_.jpeg"
          alt="Background Image"
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            margin: "0",
            padding: "0",
            zIndex: "0",
            position: "absolute",
            filter: isLight ? undefined : "brightness(0.5)",
            
          }}
        />
        <Col
          style={{
            backgroundColor: isLight ? "#ffffff73" : "#0000009c",
            padding: "20px",
            maxWidth: "fit-content",
            borderRadius: "10px",
            zIndex: "99",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "3rem", fontWeight: "bold" }}
          >
            RecruitHub
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontSize: "1.5rem", margin: "20px 0", fontWeight: "bold" }}
          >
            Connecting {isCompany ? "Companies" : "ITI Graduates"} to the World
            of {isCompany ? "Talents" : "Work"}
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button
              variant="primary"
              className="me-3"
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#901b20",
                border: "none",
                color: isLight ? "white" : "black",
              }}
              onClick={() => handleClick()}
            >
              Get Started
            </Button>
            <Button
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#901b20",
                border: "none",
                color: isLight ? "white" : "black",
              }}
              onClick={() => handleClick()}
            >
              {!user?.id
                ? "Login"
                : isJobSeeker
                ? "Browse Jobs"
                : isCompany
                ? "Post a Job"
                : "Manage Website"}
            </Button>
          </motion.div>
        </Col>
      </Row>
      {/* Split Section for Applicants and Recruiters */}
      {!user?.id && (
        <Row
          className="split-section mx-auto"
          style={{
            padding: "50px 0",
            textAlign: "center",
            backgroundColor: isLight ? "#f8f9fa" : "#333",
            marginTop: "10px",
          }}
        >
          <Col
            md={6}
            style={{
              backgroundColor: isLight ? "#f8f9fa" : "transparent",
              padding: "30px",
              borderRight: isLight ? "1px solid #ddd" : "1px solid #882024",
            }}
          >
            <h2 style={{ color: "#901b20", fontWeight: "bold" }}>
              For ITI Graduates
            </h2>
            <p
              style={{
                margin: "20px 0",
                fontSize: "1.2rem",
                color: isLight ? "black" : "white",
              }}
            >
              Discover job opportunities tailored to your skills and expertise.
              Build your career with ease and confidence.
            </p>
            <Button
              variant="primary"
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#901b20",
                border: "none",
              }}
              onClick={() => handleClick()}
            >
              Join Itians
            </Button>
          </Col>
          <Col
            md={6}
            style={{
              backgroundColor: isLight ? "#ffffff" : "transparent",
              padding: "30px",
            }}
          >
            <h2 style={{ color: "#901b20", fontWeight: "bold" }}>
              For Recruiters
            </h2>
            <p
              style={{
                margin: "20px 0",
                fontSize: "1.2rem",
                color: isLight ? "black" : "white",
              }}
            >
              Find top talent from ITI graduates. Post jobs and connect with the
              right candidates effortlessly.
            </p>
            <Button
              variant="primary"
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#901b20",
                border: "none",
              }}
              onClick={() => handleClick()}
            >
              Become Recruiter
            </Button>
          </Col>
        </Row>
      )}
      {/* Job Types Section */}
      <Box
        style={{
          backgroundColor: isLight ? "#f8f9fa" : "#222222",
          padding: "10px 0",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        {isJobSeeker || !user?.id ? (
          <Row
            className="job-types-section mx-auto"
            style={{ padding: "20px 0", textAlign: "center" }}
          >
            <h2
              style={{
                color: "#901b20",
                fontWeight: "bold",
                marginBottom: "30px",
                textDecoration:'underline'
              }}
            >
              Find Your Dream Job
            </h2>
            <Row className="justify-content-center">
              <Col md={6} lg={3} style={{ padding: "15px" }}>
                <Card style={{ backgroundColor: isLight ? 'white' : 'black', border: isLight ? null : '2px solid #901b20', borderRadius: '10px' }}>
                  <Card.Img
                    variant="top"
                    src="https://img.freepik.com/premium-photo/text-full-time-job-written-lightbox-with-alarm-clock-colorfull-stickers-blue-background_132358-5491.jpg"
                    alt="Full-Time"
                    style={{ borderRadius: "10px" }}
                    height="200px"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ color: isLight ? "#901b20" : 'white', fontWeight: "bold"  }}
                    >
                      Full-Time
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} style={{ padding: "15px" }}>
                <Card style={{ backgroundColor: isLight ? 'white' : 'black', border: isLight ? null : '2px solid #901b20', borderRadius: '10px' }}>
                  <Card.Img
                    variant="top"
                    src="https://img.freepik.com/premium-photo/red-alarm-clock-with-text-parttime-job_132358-5465.jpg"
                    alt="Part-Time"
                    style={{ borderRadius: "10px" }}
                    height="200px"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ color: isLight ? "#901b20" : 'white', fontWeight: "bold"  }}
                    >
                      Part-Time
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={6} lg={3} style={{ padding: "15px" }}>
                <Card style={{ backgroundColor: isLight ? 'white' : 'black', border: isLight ? null : '2px solid #901b20', borderRadius: '10px' }}>
                  <Card.Img
                    variant="top"
                    src="https://img.freepik.com/premium-photo/business-people-group_780838-13844.jpg"
                    alt="Internship"
                    style={{ borderRadius: "10px" }}
                    height="200px"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ color: isLight ? "#901b20" : 'white', fontWeight: "bold"  }}
                    >
                      Internship
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} style={{ padding: "15px" }}>
                <Card style={{ backgroundColor: isLight ? 'white' : 'black', border: isLight ? null : '2px solid #901b20', borderRadius: '10px' }}>
                  <Card.Img
                    variant="top"
                    src="https://img.freepik.com/free-photo/side-view-entrepreneur-working-laptop_23-2148446302.jpg"
                    alt="Freelance"
                    style={{ borderRadius: "10px" }}
                    height="200px"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ color: isLight ? "#901b20" : 'white', fontWeight: "bold"  }}
                    >
                      Freelance
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Row>
        ) : null}
        {!user?.id && (
          <Row
            className="mx-auto"
            style={{
              padding: "5px 0",
              textAlign: "center",
              backgroundColor: isLight ? "white" : "#1c0000",
            }}
          >
            {/* <p>divider</p> */}
          </Row>
        )}
        {isCompany || !user?.id ? (
          <Row
            className="job-types-section mx-auto"
            style={{ padding: "20px 0", textAlign: "center" }}
          >
            <h2
              style={{
                color: "#901b20",
                fontWeight: "bold",
                marginBottom: "30px",
                textDecoration:'underline'
              }}
            >
              ITI Graduates
            </h2>
            <Row className="justify-content-center">
              <Col md={6} lg={3} style={{ padding: "15px" }}>
                <Card style={{ backgroundColor: isLight ? 'white' : 'black', border: isLight ? null : '2px solid #901b20', borderRadius: '10px' }}>
                  <Card.Img
                    variant="top"
                    src="https://www.ue-germany.com/uploads/sites/9/2022/07/digital-business-data-sience-960x540-1.jpg"
                    alt="Data Scientists"
                    style={{ borderRadius: "10px" }}
                    height="200px"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ color: isLight ? "#901b20" : 'white', fontWeight: "bold"  }}
                    >
                      Data Scientists
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} style={{ padding: "15px" }}>
                <Card style={{ backgroundColor: isLight ? 'white' : 'black', border: isLight ? null : '2px solid #901b20', borderRadius: '10px' }}>
                  <Card.Img
                    variant="top"
                    src="https://thecyberexpress.com/wp-content/uploads/2022/12/How-to-Become-a-Cyber-Security-Engineer-750x375.jpg?crop=1"
                    alt="Cyber Security"
                    style={{ borderRadius: "10px" }}
                    height="200px"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ color: isLight ? "#901b20" : 'white', fontWeight: "bold"  }}
                    >
                      Cyber Security
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={6} lg={3} style={{ padding: "15px" }}>
                <Card style={{ backgroundColor: isLight ? 'white' : 'black', border: isLight ? null : '2px solid #901b20', borderRadius: '10px' }}>
                  <Card.Img
                    variant="top"
                    src="https://img.freepik.com/premium-photo/business-people-group_780838-13844.jpg"
                    alt="Software Developers"
                    style={{ borderRadius: "10px" }}
                    height="200px"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ color: isLight ? "#901b20" : 'white', fontWeight: "bold"  }}
                    >
                      Software Developers
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3} style={{ padding: "15px" }}>
                <Card style={{ backgroundColor: isLight ? 'white' : 'black', border: isLight ? null : '2px solid #901b20', borderRadius: '10px' }}>
                  <Card.Img
                    variant="top"
                    src="https://img.freepik.com/free-photo/logo-designer-working-computer-desktop_23-2149142153.jpg?ga=GA1.1.2112067204.1743957977&semt=ais_hybrid&w=740"
                    alt="Graphic Designers"
                    style={{ borderRadius: "10px" }}
                    height="200px"
                  />
                  <Card.Body>
                    <Card.Title
                      style={{ color: isLight ? "#901b20" : 'white', fontWeight: "bold"  }}
                    >
                      Graphic Designers
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Row>
        ) : null}
      </Box>
      <div
        className="numbers"
        style={{
          marginBottom: "10px",
          marginTop: "10px",
          backgroundColor: isLight ? "white" : "#333",
          padding: "30px",
        }}
      >
        <div className="header" style={{ marginBottom: "20px" }}>
          <div
            className="vertical-line"
            style={{
              width: "5px",
              height: "50px",
              backgroundColor: "#901b20",
              margin: "0 auto",
            }}
          ></div>
          <div className="title" style={{ textAlign: "center" }}>
            <h2
              style={{
                margin: "10px 0",
                fontSize: "24px",
                color: isLight ? "#333" : "#a83236",
              }}
            >
              ITI in numbers
            </h2>
            <h3
              style={{
                margin: "0",
                fontSize: "18px",
                color: isLight ? "#555" : "#a83236",
              }}
            >
              Quick facts about ITI
            </h3>
          </div>
        </div>
        <div
          className="cards"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "10px",
              border: isLight ?"1px solid #ddd" : '1px solid rgb(94, 23, 26)',
              borderRadius: "8px",
              width: "150px",
              backgroundColor: isLight ? "#fff" : 'black',
            }}
          >
            <h1
              className="number"
              style={{ fontSize: "36px", color: "#901b20", margin: "0" }}
            >
              32
            </h1>
            <h2 style={{ fontSize: "16px", color: isLight ? "#333" : 'white', margin: "10px 0 0" }}>
              IT Specializations
            </h2>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "10px",
              border: isLight ?"1px solid #ddd" : '1px solid rgb(94, 23, 26)',
              borderRadius: "8px",
              width: "150px",
              backgroundColor: isLight ? "#fff" : 'black',
            }}
          >
            <h1
              className="number"
              style={{ fontSize: "36px", color: "#901b20", margin: "0" }}
            >
              85%
            </h1>
            <h2 style={{ fontSize: "16px", color: isLight ? "#333" : 'white', margin: "10px 0 0" }}>
              Annual Employment Rate
            </h2>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "10px",
              border: isLight ?"1px solid #ddd" : '1px solid rgb(94, 23, 26)',
              borderRadius: "8px",
              width: "150px",
              backgroundColor: isLight ? "#fff" : 'black',
            }}
          >
            <h1
              className="number"
              style={{ fontSize: "36px", color: "#901b20", margin: "0" }}
            >
              500+
            </h1>
            <h2 style={{ fontSize: "16px", color: isLight ? "#333" : 'white', margin: "10px 0 0" }}>
              Companies
            </h2>
          </div>
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "10px",
              border: isLight ?"1px solid #ddd" : '1px solid rgb(94, 23, 26)',
              borderRadius: "8px",
              width: "150px",
              backgroundColor: isLight ? "#fff" : 'black',
            }}
          >
            <h1
              className="number"
              style={{ fontSize: "36px", color: "#901b20", margin: "0" }}
            >
              80+
            </h1>
            <h2 style={{ fontSize: "16px", color: isLight ? "#333" : 'white', margin: "10px 0 0" }}>
              Universities & Faculties
            </h2>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
