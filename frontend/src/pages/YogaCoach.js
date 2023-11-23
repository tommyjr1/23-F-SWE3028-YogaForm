import * as cam from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import * as mediapipePose from "@mediapipe/pose";
import { Pose } from "@mediapipe/pose";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Webcam from "react-webcam";
import yogaImage from "../assets/yoga_image.gif";
// import AudioPlayer from 'react-h5-audio-player';

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
  const audioRef = useRef(null);
  let camera = null;
  // const [userPoseAngle, setUserPoseAngle] = use
  let userPoseAngle = null;

  const [message, setMessage] = useState("");
  const [audio, setAudio] = useState();

  const navigate = useNavigate();
  const goToLogInPage = () => {
    stopWebCam();
    navigate("/LogInPage");
  };
  const goToYogaList = () => {
    stopWebCam();
    navigate("/YogaList");
  };
  const goToLandingPage = () => {
    stopWebCam();
    navigate("/LandingPage");
  };

  async function onResults(results) {
    let landmarks = results.poseLandmarks; // * all the landmarks in the pose
    // submitLandmarkData(landmarks);
    // requestAudioFile();

    //  * getting the values for the three landmarks that we want to use
    try {
      // * we get errors every time the landmarks are not available
      // * will provide dynamic landmarks later "landmarks[mediapipePose.POSE_LANDMARKS.{landmark}]"
      let leftShoulder = await landmarks[
        mediapipePose.POSE_LANDMARKS.LEFT_SHOULDER
      ];
      let leftElbow = await landmarks[mediapipePose.POSE_LANDMARKS.LEFT_ELBOW];
      let leftWrist = await landmarks[mediapipePose.POSE_LANDMARKS.LEFT_WRIST];
      // console.log(leftWrist);
      // calculatePoseAngle(leftWrist, leftElbow, leftShoulder);
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
      results.poseLandmarks,
      mediapipePose.POSE_CONNECTIONS,
      { color: "white", lineWidth: 1 }
    );
    // * The dots are the landmarks
    drawLandmarks(canvasCtx, results.poseLandmarks, {
      color: "red",
      lineWidth: 1,
      radius: 2,
    });
    canvasCtx.restore();
  }

  const calculatePoseAngle = async (a, b, c) => {
    // Calculate the dot product and the magnitudes of the vectors
    let dot_product = await ((b.x - a.x) * (b.x - c.x) +
      (b.y - a.y) * (b.y - c.y) +
      (b.z - a.z) * (b.z - c.z));
    let point_1_2_mag = await Math.sqrt(
      Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2)
    );
    let point_2_3_mag = await Math.sqrt(
      Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2) + Math.pow(b.z - c.z, 2)
    );

    // Calculate the angle between the left hand, elbow, and shoulder landmarks in degrees
    let angle = await (Math.acos(
      dot_product / (point_1_2_mag * point_2_3_mag)
    ) *
      (180 / Math.PI));

    userPoseAngle = angle.toFixed(2);
    console.log(userPoseAngle);
    if (userPoseAngle != null) {
      // submitAngleData();
      // checkAngle();
    }
  };

  const checkAngle = async () => {
    await axios
      .get("http://3.35.60.125:8080/api/check")
      .then((response) => {
        if (response.data !== "none") {
          setMessage(response.data);
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const submitAngleData = async () => {
    // console.log(typeof userPoseAngle);

    await axios
      .post("http://3.35.60.125:8080/api/angle", {
        value: userPoseAngle
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitLandmarkData = async (landmarks) => {
    // console.log(typeof userPoseAngle);

    await axios
      .post("http://3.35.60.125:8080/api/angle", {
        value: JSON.stringify(landmarks),
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestAudioFile = async () => {
    // const isNext = await axios.get('http://3.35.60.125:8080/api/complete', {

    // })
    console.log("request audio");

    const { data } = await axios
      .get("http://3.35.60.125:8080/api/feedback", {
        responseType: "arraybuffer",
        headers: { Accept: "*/*", "Content-Type": "audio/wav" },
      })
      .then((resp) => resp);
    const blob = new Blob([data], {
      type: "audio/wav",
    });
    const url = URL.createObjectURL(blob);
    setAudio(url);

    var audio_bell = document.getElementById("tts");
    setInterval(function () {
      audio_bell.play();
    }, 2.5 * 1000);

    // const audioElement = audioRef.current;
    // If audio source changes and it's set
    // if (audio && audioElement) {
    //   audioElement.autoplay = true; // Set autoplay attribute
    //   audioElement.load(); // Reload the audio element
    // }

    // const element = document.getElementById('tts');
    // element.click();
    // audioElement.play();
  };

  setInterval(requestAudioFile, 2000);
  setInterval(submitLandmarkData, 1000);

  function AudioPlayer({ audio }) {
    return <audio id="tts" controls ref={audioRef} src={audio} />;
  }

  const stopWebCam = () => {
    if (webcamRef.current.video) {
      let stream = webcamRef.current.video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      webcamRef.current.video.srcObject = null;
    }
  };

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
      webcamRef.current &&
      webcamRef.current.video
    ) {
      // console.log(webcamRef.current.video);
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
        <Button variany="secondary" style={buttonStyle} onClick={goToLandingPage}>
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
          onClick={goToLogInPage}
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
          {/* type="audio/mpeg" */}
          <AudioPlayer {...{ audio }} />
          {/* <AudioPlayer src={audio} ref={audioRef} autoPlay={true}/> */}
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
