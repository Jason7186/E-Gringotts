package com.egringotts.egringotts.service;

import lombok.AllArgsConstructor;
import org.jboss.aerogear.security.otp.Totp;
import org.jboss.aerogear.security.otp.api.Base32;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthenticationService {

    private CommunicationService communicationService;
    private OTPService otpService;

    public String generateAndSendOTP(String email) {
        String secret = Base32.random(); // This should be saved associated with the user's account securely
        Totp totp = new Totp(secret);
        String code = totp.now();

        otpService.storeOTPData(email, secret);

        // Send this code via email
        communicationService.sendOTPEmail(email, code);

        return secret;
    }
}

