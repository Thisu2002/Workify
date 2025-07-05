import React from "react";
import NavBar from "../components/NavBar";
import "../styles/Home.css";
import woman from "../images/woman.png";
import members from "../images/members.png";
import ellipse from "../images/ellipse.png";
import post from "../images/post.png";
import browse from "../images/browse.png";
import mentor from "../images/mentor.png";
import Button from "@mui/material/Button";
const Home = () => {
  return (
    <div className="home-container">
      <NavBar />
      <section id="home">
        <div>
          <h1
            style={{
              color: "white",
              fontSize: "3rem",
              lineHeight: "1.1",
              margin: "0px",
            }}
          >
            EMPOWERING CAREERS, <br /> CONNECTING TALENT
          </h1>
          <h3>CONNECTING TALENT WITH OPPORTUNITY</h3>
          <p>
            Discover your next job, post openings, <br />
            or get expert guidance — all in one <br />
            smart platform built for career success.
          </p>
          <Button
            variant="contained"
            sx={{
              borderRadius: "10px",
              backgroundImage: "linear-gradient(45deg, #0F2445, #3B5998)",
              "&:hover": {
                backgroundImage: "linear-gradient(45deg, #3B5998, #0F2445)",
                transition: "background-image 0.4s ease-in-out",
              },
            }}
          >
            Browse Jobs
          </Button>{" "}
          <br />
          <img className="members" src={members} alt=""></img>
        </div>
        <img className="woman" src={woman} alt=""></img>
      </section>
      <section id="about-us">
        <img alt="" src={ellipse}></img>
        <div>
          <h4>ABOUT US</h4>
          <h2>Bridge for Industrial and Corporate Development</h2>
          <p>
            We’re dedicated to provide a smart job portal that connects job
            seekers, recruiters, and mentors in one place. Our platform offers
            intelligent job matching, real-time CV tracking, and personalized
            mentoring to make the hiring process faster, easier, and more
            meaningful for everyone.
          </p>
          <Button
            variant="contained"
            sx={{
              borderRadius: "10px",
              backgroundImage: "linear-gradient(45deg, #0F2445, #3B5998)",
              "&:hover": {
                backgroundImage: "linear-gradient(45deg, #3B5998, #0F2445)",
                transition: "background-image 0.4s ease-in-out",
              },
            }}
          >
            Discover More
          </Button>{" "}
        </div>
      </section>
      <section id="services">
        <h4>OUR SERVICES</h4>
        <br />
        <div className="services-container">
          <div className="service-card">
            <img src={post} alt="Post Jobs" />
            <h3>Post Job Openings</h3>
            <p>
              Recruiters can create and manage job postings with ease. Our
              platform helps you find the most suitable candidates through smart
              matching and organized applicant management.
            </p>
          </div>
          <div className="service-card">
            <img src={browse} alt="Browse Jobs" />
            <h3>Browse Jobs</h3>
            <p>
              Candidates can explore job opportunities tailored to their skills,
              interests, and experience. Apply with confidence and access jobs
              that truly match your career goals.
            </p>
          </div>
          <div className="service-card">
            <img src={mentor} alt="Mentoring" />
            <h3>Mentoring Sessions</h3>
            <p>
              Connect with industry mentors for personalized guidance on resume
              building, interview preparation, and career development. Grow your
              confidence and sharpen your skills with professional support.
            </p>
          </div>
        </div>
      </section>
      <section id="contact-us">Contact Us</section>
      <section id="footer">Footer</section>
    </div>
  );
};

export default Home;
