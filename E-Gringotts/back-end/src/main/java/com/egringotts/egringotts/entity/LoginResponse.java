package com.egringotts.egringotts.entity;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginResponse {
    // Getters (and optionally setters if needed)
    private String email;
    private String token;

    public LoginResponse(String email, String token) {
        this.email = email;
        this.token = token;
    }

}
