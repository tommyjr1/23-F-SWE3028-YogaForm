import React, { useEffect, useState} from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import ConditionalHeader from "../components/ConditionalHeader";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";

const YogaList = () => {
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    try {
      const { search } = location;
      const queryObj = queryString.parse(search);
      const { isLogin } = queryObj;
      setIsLoggedIn(isLogin === "true");
    } catch {
      console.log("no");
      setIsLoggedIn(false);
    }
  }, [location]);

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
        <h1 style={{ paddingLeft: "40px" }}>Instruction</h1>
        <p style={{ fontSize: "1.4rem", paddingRight: "180px" }}>
          {" "}
          qqqqqqqqqqqqqqqqq
        </p>
      </div>
    </div>
  );
};

export default YogaList;
