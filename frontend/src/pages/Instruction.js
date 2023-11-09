import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Webcam from "react-webcam";
import { useRef, useEffect } from "react";
import * as mediapipePose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";
import { useNavigate } from "react-router-dom";
import YogaCoach from './YogaCoach';

function Instruction() {
    const bodyStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#F2CCFF",
        color: "#3B2C77"
    }
    const buttonStyle = {
    backgroundColor:"#F2CCFF", 
    border: "1px solid #F2CCFF",
    color: "#3B2C77",
    fontSize: "1.6rem"
    }
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    let camera = null;
    let userPoseAngle = null;
    const [x, setX] = useState(false);
    const [msg, setMsg] = useState(
        "Stand so that your entire body is visible on the camera."
    );

  function onResults(results) {
    let landmarks = results.poseLandmarks; // * all the landmarks in the pose

    //  * getting the values for the three landmarks that we want to use
    try {
      // * we get errors every time the landmarks are not available
      // * will provide dynamic landmarks later "landmarks[mediapipePose.POSE_LANDMARKS.{landmark}]"
      let nose = landmarks[mediapipePose.POSE_LANDMARKS.NOSE];
      let leftWrist = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_WRIST];
      let rightWrist = landmarks[mediapipePose.POSE_LANDMARKS.RIGHT_WRIST];
      //let leftFoot = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_FOOT_INDEX];
      //let rightFoot = landmarks[mediapipePose.POSE_LANDMARKS.RIGHT_FOOT_INDEX];
      checkVisibility(nose, leftWrist, rightWrist);
    } catch (error) {
      //console.error(error);
    }
    // Define the canvas element dimensions using the earlier created refs
    canvasRef.current.width = webcamRef.current.video.videoWidth;
    canvasRef.current.height = webcamRef.current.video.videoHeight;

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    canvasCtx.restore();
  }
  useEffect(() => {
    const userPose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });
    userPose.setOptions({
      selfieMode: true,
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    userPose.onResults(onResults);
    if (typeof webcamRef.current !== "undefined" && webcamRef.current && webcamRef.current.video) {
        console.log(webcamRef.current.video);
      camera = new cam.Camera(webcamRef.current.video, {
        // no issues with the exaustive-deps. We do not need to store the camera object for current purposes
        onFrame: async () => {
          await userPose.send({ image: webcamRef.current.video });
        },
        // width: 1280,
        // height: 720,
        width: 600,
        height: 400
      });
      camera.start();
    }
  }, []);

  const checkVisibility = (a, b, c) => {
    if (
      (a.visibility > 0.5) &
      (b.visibility > 0.5) &
      (c.visibility > 0.5) //&
      //(d.visibility > 0.5) &
      //(e.visibility > 0.5)
    ) {
      setX(true);
      setMsg("Great");
    }
  };

  const navigate = useNavigate();
  const goToYogaCoach = () => {
    navigate("/YogaCoach");
  };

  return (
    <div className="Instruction" style={bodyStyle}>
        <header style={{display: "flex", flexDirection: "row", paddingTop: "1rem",paddingBottom: "1rem", justifyContent:"space-around"}}><div style={{fontWeight: "bold", fontSize: "1.8rem"}}>YOGA FORM</div><div></div><div></div><div></div><div></div><div></div>
          <Button variany="secondary" style={buttonStyle}>HOME</Button><Button variany="secondary" style={buttonStyle}>ABOUT</Button><Button variany="secondary" style={buttonStyle}>YOGA</Button><Button variany="secondary" style={{backgroundColor: "#FFF2CC", border: "1px solid #FFF2CC",borderRadius: '2rem', width: "100px", color: "#3B2C77",fontSize: "1.6rem"}}>Log-in</Button></header>
        <hr style={{borderColor: "#3B2C77"}}/>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <h1 style={{paddingLeft: "40px"}}>Instruction</h1>
            <p style={{fontSize: "1.4rem", paddingRight: "180px"}}> {`${msg}`}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Webcam
            ref={webcamRef}
            style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                zindex: 9,
            }}
            />
            <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                marginLeft: "auto",
                marginRight: "auto",
                zindex: 9,
            }}
            ></canvas>
        </div>
        <button style={{ opacity: x ? 100 : 0 , position: "absolute", left: "80%", bottom: "10%",backgroundColor: "#FFF2CC", border: "1px solid #FFF2CC", borderRadius: '2rem', width: "100px", color: "#3B2C77",fontSize: "1.6rem"}} onClick={goToYogaCoach}>
            NEXT
        </button>
    </div>
  );
}

export default Instruction;
