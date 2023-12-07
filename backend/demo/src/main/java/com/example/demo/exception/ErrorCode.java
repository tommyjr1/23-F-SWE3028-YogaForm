package com.example.demo.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    ADMIN_TOKEN(HttpStatus.BAD_REQUEST, "관리자 암호가 일치하지않습니다"),
    SAME_EMAIL(HttpStatus.BAD_REQUEST, "동일한 이메일이 존재합니다."),
    NO_GOOGLE(HttpStatus.BAD_REQUEST, "구글 계정이 존재하지 않습니다."),
    NO_USER(HttpStatus.BAD_REQUEST, "없는 사용자입니다."),
    NO_LOGIN(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다"),
    NO_ADMIN(HttpStatus.FORBIDDEN, "권한이 없는 사용자입니다"),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AccessToken이 만료되었습니다.");


    private HttpStatus httpStatus;
    private String detail;
}
