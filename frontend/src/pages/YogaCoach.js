import React from 'react';
import yogaIcon from '../assets/yoga_icon.png';
import yogaImage from '../assets/yoga_image.gif';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useRef, useEffect } from 'react';
import Webcam from "react-webcam";
import * as mediapipePose from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { Pose } from "@mediapipe/pose";

const YogaCoach = () => {  
    const buttonStyle = {
      width: "40%", 
      height: "40%", 
      minWidth: '2rem', 
      borderWidth: '0.25rem', 
      fontSize : '1rem',
      fontWeight: 'bold'
    }
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    let camera = null;
    let userPoseAngle = null;

    function onResults(results) {
      let landmarks = results.poseLandmarks // * all the landmarks in the pose
  
      //  * getting the values for the three landmarks that we want to use
      try { // * we get errors every time the landmarks are not available
          // * will provide dynamic landmarks later "landmarks[mediapipePose.POSE_LANDMARKS.{landmark}]"
          let leftShoulder = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_SHOULDER];
          let leftElbow = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_ELBOW];
          let leftWrist = landmarks[mediapipePose.POSE_LANDMARKS.LEFT_WRIST];
          calculatePoseAngle(leftShoulder, leftElbow, leftWrist);
      } catch (error) {
          // console.error(error);
      }
      // Define the canvas element dimensions using the earlier created refs
      canvasRef.current.width = webcamRef.current.video.videoWidth
      canvasRef.current.height = webcamRef.current.video.videoHeight
  
      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d")
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
      )
      drawConnectors(canvasCtx,
          results.poseLandmarks, mediapipePose.POSE_CONNECTIONS,
          { color: 'white', lineWidth: 1 });
      // * The dots are the landmarks 
      drawLandmarks(canvasCtx, results.poseLandmarks,
          { color: 'red', lineWidth: 1, radius: 2 });
      canvasCtx.restore();
    }

    const calculatePoseAngle = (a, b, c) => {
      let radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x) // * fetching the radians using the atan2 function 
      let angle = radians * (180 / Math.PI) // * calculating the angle from the radian
      // need to provide dynamic values for angles as per requirement later along with the number of reps.
      if (angle > 180) { // * if the angle is greater than 180, then it is negative so changing it back to positive or an actual angle possible for a human being, lol..
          angle = 360 - angle
      }
      if (angle > 0 && angle < 180) { // * if the angle is positive, then it is a positive angle
          // console.log(angle.toFixed(2), "currentAngle");
      }
      userPoseAngle = angle.toFixed(2);
      // calculateReps(userPoseAngle);
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
      if (
          typeof webcamRef.current !== "undefined" &&
          webcamRef.current !== null
      ) {
          camera = new cam.Camera(webcamRef.current.video, { // no issues with the exaustive-deps. We do not need to store the camera object for current purposes
              onFrame: async () => {
                  await userPose.send({ image: webcamRef.current.video });
              },
              width: 1280,
              height: 720,
          });
          camera.start();
      }
  }, []);
    return (
        <div className="App">
        <h1>
          Let's do the yoga together!
        </h1>
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <div>
          <Webcam ref={webcamRef} style={{flex: 1}}/>
          <canvas ref={canvasRef} style={{flex: 1}}></canvas>
          </div>
          <div style={{alignContent: "center"}}>
            <img src={yogaImage} style={{height: "20rem"}}></img>
            <p>무희자세</p>
            <p>...infromation of the posture...</p>
          </div>
        </div>
      </div>
    );
};

export default YogaCoach;