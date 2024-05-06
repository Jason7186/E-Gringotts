package com.egringotts.egringotts;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class UserDto {
    @NotNull
    private String name;
    @Past
    private LocalDate dateOfBirth;
    @Email
    private String email;
    @NotNull
    @ValidPassword
    private String password;
    private String securityPin;
}
