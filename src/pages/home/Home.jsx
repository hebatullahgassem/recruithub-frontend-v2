import React from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
// import "./home.css";

const Home = () => {
  return (
    <Container fluid className="home-container">
      {/* Hero Section */}
      <Row className="hero-section text-center text-white">
        <Col>
          <motion.h1 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}>
            Find Your Dream Job Easily
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}>
            Connect with top companies and land your ideal job today!
          </motion.p>
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 1, duration: 0.5 }}>
            <Button variant="primary" className="me-3">Get Started</Button>
            <Button variant="outline-light">Post a Job</Button>
          </motion.div>
        </Col>
      </Row>

      {/* Featured Jobs Section */}
      <Row className="text-center mt-5">
        <Col>
          <h2>Top Jobs Available</h2>
          <p>Explore the latest job listings from reputable companies.</p>
        </Col>
      </Row>

      <Row className="job-cards mt-4">
        {/* Example Job Cards */}
        {[1, 2, 3].map((job, index) => (
          <Col key={index} md={4}>
            <motion.div 
              className="job-card p-4 shadow rounded" 
              whileHover={{ scale: 1.05 }}>
              <h5>Software Engineer</h5>
              <p>Company Name • Full-Time</p>
              <Button variant="success">Apply Now</Button>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
