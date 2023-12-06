import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ConditionalHeader from "../components/ConditionalHeader";
import queryString from "query-string";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from "chart.js";
import { Bar, Line } from 'react-chartjs-2';

const MyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [routine, setRoutine] = useState('');
  const [images, setImages] = useState([]);
  const [grades, setGrades] = useState([]);
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [options, setOptions] = useState({ scales: { y: { beginAtZero: true } } });
  const [x, setX] = useState(false);
  const location = useLocation();

  ChartJS.register(...registerables);

  const bodyStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#F2CCFF",
    color: "#3B2C77",
  };
  const buttonStyle = {
    backgroundColor: "#F2CCFF",
    border: "1px solid #F2CCFF",
    color: "#3B2C77",
    fontSize: "1.6rem",
  };

  const saveResults = () => {
    console.log("save");
  };

  const getRoutine = async (routine) => {
    // console.log(typeof userPoseAngle);
    console.log(routine);

    await axios
      .get(`http://3.35.60.125:8080/yf/user/routine/${routine}`, {
        responseType: "json"
      })
      .then((response) => {
        setImages(response.data.split(','));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

  useEffect(() => {
    try {
      const { search } = location;
      const queryObj = queryString.parse(search);
      const { isLogin, userRoutine } = queryObj;
      setIsLoggedIn(isLogin === "true");
      setRoutine(userRoutine);
      console.log(userRoutine);
    } catch {
      console.log("no");
      setIsLoggedIn(false);
    }

    if (isLoggedIn){
      setX(true);
    }
    // setGrades(location.state?.data || []);
    setGrades([98, 79]);
  }, [location]);

  useEffect(() => {
    console.log(routine);
    getRoutine(routine);
    
  }, [routine]);

  useEffect(() => {
    if (images.length !== 0 && grades.length !== 0){
      setData({
        labels: images,
        datasets: [
          {
            label: 'Grades',
            data: grades,
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Bar color
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
    
  }, [images, grades]);

  return (
    <div className="App" style={bodyStyle}>
      <ConditionalHeader isLoggedIn={isLoggedIn}></ConditionalHeader>
      <hr style={{ borderColor: "#3B2C77" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ paddingLeft: "40px" }}>Results</h1><br/>
          <p style={{ fontSize: "1.4rem", paddingLeft: "40px" }}>
            Routine : {`${routine}`}
          </p>
        </div>
        <div style={{ fontSize: "1.4rem", paddingRight: "180px" }}>
          <Bar data={data} options={options} />
        </div>
        <button
          style={{
            opacity: x ? 100 : 0,
            position: "absolute",
            left: "80%",
            bottom: "10%",
            backgroundColor: "#FFF2CC",
            border: "1px solid #FFF2CC",
            borderRadius: "2rem",
            width: "100px",
            color: "#3B2C77",
            fontSize: "1.6rem",
          }}
          onClick={saveResults}
        >
          SAVE
        </button>
      </div>
    </div>
  );
};

export default MyPage;
