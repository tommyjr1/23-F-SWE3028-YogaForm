import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import * as mediapipePose from "@mediapipe/pose";
import { Pose } from "@mediapipe/pose";
import axios from "axios";
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Button } from "react-bootstrap";
import Webcam from "react-webcam";
import yogaImage from "../assets/yoga_image.gif";
import { useNavigate } from "react-router-dom";

const YogaCoach = () => {
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
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let camera = null;
  // const [userPoseAngle, setUserPoseAngle] = use
  let userPoseAngle = null;

  const [message, setMessage] = useState("");

  function onResults(results) {
    let landmarks = results.poseLandmarks; // * all the landmarks in the pose
    let leftShoulder = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_SHOULDER];
    let leftElbow = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_ELBOW];
    let leftWrist = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_WRIST];
    //  * getting the values for the three landmarks that we want to use
    try {
      // * we get errors every time the landmarks are not available
      // * will provide dynamic landmarks later "landmarks[mediapipePose.POSE_LANDMARKS.{landmark}]"
      // let leftShoulder = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_SHOULDER];
      // let leftElbow = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_ELBOW];
      // let leftWrist = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_WRIST];
      calculatePoseAngle(leftShoulder, leftElbow, leftWrist);
    } catch (error) {
      // console.error(error);
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
    drawConnectors(
      canvasCtx,
      //results.poseLandmarks,
      [leftShoulder, leftElbow, leftWrist],
      mediapipePose.POSE_CONNECTIONS,
      { color: "white", lineWidth: 1 }
    );
    // * The dots are the landmarks
    drawLandmarks(
      canvasCtx,
      //results.poseLandmarks,
      [leftShoulder, leftElbow, leftWrist],
      {
        color: "red",
        lineWidth: 1,
        radius: 2,
      }
    );
    canvasCtx.restore();
  }

  const calculatePoseAngle = (a, b, c) => {
    let radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x); // * fetching the radians using the atan2 function
    let angle = radians * (180 / Math.PI); // * calculating the angle from the radian
    // need to provide dynamic values for angles as per requirement later along with the number of reps.
    if (angle > 180) {
      // * if the angle is greater than 180, then it is negative so changing it back to positive or an actual angle possible for a human being, lol..
      angle = 360 - angle;
    }
    if (angle > 0 && angle < 180) {
      // * if the angle is positive, then it is a positive angle
      // console.log(angle.toFixed(2), "currentAngle");
    }
    userPoseAngle = angle.toFixed(2);
    //console.log(userPoseAngle);
    if (userPoseAngle != null) {
      submitAngleData();
      checkAngle();
    }
    // calculateReps(userPoseAngle);
  };

  const checkAngle = async () => {
    await axios
      .get("http://3.35.60.125:8080/api/check")
      .then((response) => {
        if (response.data !== "none") {
          setMessage(response.data);
          //console.log(response.data);
        }
      })
      .catch((error) => {
        //console.log(error);
      });
  };
  const submitAngleData = async () => {
    //console.log(typeof userPoseAngle);

    await axios
      .post("http://3.35.60.125:8080/api/angle", {
        value: userPoseAngle,
      })
      .then((response) => {
        //console.log(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });
  };

  const stopWebCam = () => {
    if (webcamRef.current.video) {
      let stream = webcamRef.current.video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      webcamRef.current.video.srcObject = null;
    }
  };

  useEffect(() => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current) {
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

      console.log(webcamRef.current.video);
      camera = new cam.Camera(webcamRef.current.video, {
        // no issues with the exaustive-deps. We do not need to store the camera object for current purposes
        onFrame: async () => {
          await userPose.send({ image: webcamRef.current.video });
        },
        // width: 1280,
        // height: 720,
        width: 600,
        height: 400,
      });
      camera.start();
    }
  }, []);
  // Tts.getInitStatus().then(() => {
  //   Tts.speak('Hello, world!', {
  //     iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
  //     rate: 0.5,
  //   });
  //   Tts.stop();
  // });

  const navigate = useNavigate();
  const goToYogaList = () => {
    stopWebCam();
    navigate("/YogaList");
  };

  return (
    <div className="App" style={bodyStyle}>
      <header
        style={{
          display: "flex",
          flexDirection: "row",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          justifyContent: "space-around",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.8rem" }}>YOGA FORM</div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <Button variany="secondary" style={buttonStyle}>
          HOME
        </Button>
        <Button variany="secondary" style={buttonStyle}>
          ABOUT
        </Button>
        <Button variany="secondary" style={buttonStyle} onClick={goToYogaList}>
          YOGA
        </Button>
        <Button
          variany="secondary"
          style={{
            backgroundColor: "#FFF2CC",
            border: "1px solid #FFF2CC",
            borderRadius: "2rem",
            width: "120px",
            color: "#3B2C77",
            fontSize: "1.6rem",
          }}
        >
          My page
        </Button>
      </header>
      <hr style={{ borderColor: "#3B2C77" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 200,
            left: 0,
            right: 700,
            zindex: 9,
          }}
        >
          <img src={yogaImage} style={{ height: "20rem" }}></img>
        </div>
        <div>
          <div
            style={{
              width: "600px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              padding: "1.5rem",
              position: "relative",
              left: "40%",
            }}
          >
            무희자세
          </div>
          <p>{message}</p>

          <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 500,
              right: 0,
              zindex: 9,
              width: 600,
              height: 400,
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 500,
              right: 0,
              zindex: 9,
              width: 600,
              height: 400,
            }}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

export default YogaCoach;
