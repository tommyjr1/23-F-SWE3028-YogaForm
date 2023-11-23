package com.example.demo.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.pose.Angle;
import com.example.demo.dto.pose.Joints;
import com.example.demo.dto.pose.Landmark;
import com.example.demo.dto.pose.Pose;
import com.example.demo.service.PoseService;
import com.example.demo.tts.Tts;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


@RestController
public class PoseController {

    private List<Landmark> landmark1 = new ArrayList<>();
    private List<Pose> pose1 = new ArrayList<>();
    private static final ObjectMapper mapper = new ObjectMapper();
    private Joints currentJoints;
    private Pose currentPose;
    
    @Autowired
    PoseService poseService;

    @GetMapping("/yf/pose/getInfo/{poseName}")
    public ResponseEntity getMemberById(@PathVariable("poseName") String poseName) throws IOException{
        currentPose = poseService.getPosebyName(poseName);
        // File image = File("/home/ubuntu/yogaform/23-F-SWE3028-YogaForm/backend/demo/src/main/resources/static/poses/"+ poseName +".png");

        String path = "/home/ubuntu/yogaform/23-F-SWE3028-YogaForm/backend/demo/src/main/resources/static/poses/"+ poseName +".png";
        final ByteArrayResource inputStream = new ByteArrayResource(Files.readAllBytes(Paths.get(path)));
        return ResponseEntity
                .status(HttpStatus.OK)
                .contentLength(inputStream.contentLength())
                .body(inputStream);

    }

    @ResponseBody
    @PostMapping("/yf/pose/angle")
    public void postData(@RequestBody Angle angle){

        System.out.println(angle.toString());

        String values = angle.getValue();
        System.out.println(values);

        landmark1 = null;
        try {
            landmark1 = mapper.readValue(values, new TypeReference<List<Landmark>>() {});
        } catch (JsonProcessingException e) {};

        currentJoints = poseService.calculateAll(landmark1);
        System.err.println(currentJoints.getLelbow());
    }

    @GetMapping("/yf/pose/feedback/{sentence}")
    public ResponseEntity getFeedback(@PathVariable("sentence") String sentence) throws Exception{
        // System.out.println(sentence);
        String feedback = sentence;
        // feedback = poseService.comparePose(currentPose, currentJoints);
        Tts.main(feedback);
        File f = new File("/home/ubuntu/yogaform/23-F-SWE3028-YogaForm/backend/demo/output.mp3");
        byte[] file = Files.readAllBytes(f.toPath());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Disposition", "attachment; filename=\"" + f.getName() +".wav\"");
        ResponseEntity<byte[]> response = new ResponseEntity(file, headers, HttpStatus.OK);

        return response;

        
    }

    @ResponseBody
    @PostMapping("/yf/pose/addPose")
    public void postAddPose(@RequestBody String poses){

        pose1 = null;
        try {
            pose1 = mapper.readValue(poses, new TypeReference<List<Pose>>() {});
        } catch (JsonProcessingException e) {};
        System.out.println(pose1.size());

        poseService.saveAll(pose1);

        // for (Pose pose: pose1){
        //     poseRepository.save(pose);
        // }

    }

    

}