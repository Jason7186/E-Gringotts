package com.egringotts.egringotts.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDto {
    @NotNull(message = "Name cannot be blank")
    private String name;
    private String dateOfBirth;
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password cannot be blank")
    private String password;
    private String securityPin;
}
