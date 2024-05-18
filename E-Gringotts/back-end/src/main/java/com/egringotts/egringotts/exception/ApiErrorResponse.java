package com.egringotts.egringotts.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiErrorResponse {
    private int status;
    private String message;

    public ApiErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    // Getters and Setters
    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
