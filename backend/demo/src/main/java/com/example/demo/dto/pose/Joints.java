package com.example.demo.dto.pose;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Joints {
    private String name;

    private Double lelbow;
    private Double relbow;
    private Double lshoulder;
    private Double rshoulder;
    private Double lknee;
    private Double rknee;

    
}
