package com.egringotts.egringotts.controller;

import com.egringotts.egringotts.config.JwtHelper;
import com.egringotts.egringotts.entity.*;
import com.egringotts.egringotts.repository.UserRepository;
import com.egringotts.egringotts.service.AuthenticationService;
import com.egringotts.egringotts.service.OTPService;
import com.egringotts.egringotts.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Objects;

@RestController
@AllArgsConstructor
@RequestMapping("")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;
    private final AuthenticationService authenticationService;
    private OTPService otpService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exist. Please enter another one");
            }

            User newUser = userService.registerUser(userDto);

            // Authenticate the user immediately after registration
            UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(userDto.getEmail(),
                    userDto.getPassword());
            Authentication auth = authenticationManager.authenticate(authReq);
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = JwtHelper.generateToken(userDto.getEmail());

            return ResponseEntity.ok(new LoginResponse(userDto.getEmail(), token));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginDto loginDto) {
        try {
            UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(loginDto.getEmail(),
                    loginDto.getPassword());
            Authentication auth = authenticationManager.authenticate(authReq);
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = JwtHelper.generateToken(loginDto.getEmail());
            userService.clearChatHistory(getLoggedInUser().accountId());
            return ResponseEntity.ok(new LoginResponse(loginDto.getEmail(), token));
        } catch (AuthenticationException e) {
            // This should return a ResponseEntity with an appropriate type that can handle
            // error strings.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(null, "Login failed"));
        }
    }

    @GetMapping("/user/dashboard")
    public ResponseEntity<?> getUserDashboard() {
        try {
            User currentLoggedUser = getLoggedInUser();
            UserDashboardDto userDashboardDto = userService.getUserDashboard(currentLoggedUser.email());
            return ResponseEntity.ok(userDashboardDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/user/dailyLimit")
    public ResponseEntity<?> updateDailyLimit (@RequestBody DailyLimitUpdateRequest dailyLimitUpdateRequest) {
        try {
            User currentLoggedUser = getLoggedInUser();
            if (Objects.equals(currentLoggedUser.dailyLimit(), dailyLimitUpdateRequest.getNewDailyLimit())) throw new RuntimeException("Same limit does not require update");
            userService.updateDailyLimit(currentLoggedUser, dailyLimitUpdateRequest.getNewDailyLimit());
            return ResponseEntity.ok("Daily Limit updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("user/maxTransferLimit")
    public ResponseEntity<?> updateMaxTransferLimit(@RequestBody MaxTransferLimitUpdateRequest maxTransferLimitUpdateRequest) {
        try {
            User currentLoggedUser = getLoggedInUser();
            if (Objects.equals(currentLoggedUser.maxLimitPerTransfer(), maxTransferLimitUpdateRequest.getNewMaxTransferLimit())) throw new RuntimeException("Same limit does not require update");
            userService.updateMaxLimit(currentLoggedUser, maxTransferLimitUpdateRequest.getNewMaxTransferLimit());
            return ResponseEntity.ok("Max Transfer Limit Updated Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/user/debitCardLimit")
    public ResponseEntity<?> updateDebitLimit(@RequestBody DebitLimitUpdateRequest debitLimitUpdateRequest) {
        try {
            User user = getLoggedInUser();

            if (user == null) {
                throw new Exception("User not found");
            }

            if (user.debitCardDetails().getDebitCardLimit() == debitLimitUpdateRequest.getNewDebitLimit()) {
                throw new RuntimeException("Same limit does not require update");
            }

            Update update = new Update();
            update.set("debitCardDetails.debitCardLimit", debitLimitUpdateRequest.getNewDebitLimit());

            Query query = new Query(Criteria.where("id").is(user.id()));
            mongoTemplate.updateFirst(query, update, User.class);

            return ResponseEntity.ok("Debit card limit updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/user/creditCardLimit")
    public ResponseEntity<?> updateCreditLimit(@RequestBody CreditLimitUpdateRequest creditLimitUpdateRequest) {
        try {
            User user = getLoggedInUser();

            if (user == null) {
                throw new Exception("User not found");
            }

            if (user.creditCardDetails().getCreditCardLimit() == creditLimitUpdateRequest.getNewCreditLimit()) {
                throw new RuntimeException("Same limit does not require update");
            }

            Update update = new Update();
            update.set("creditCardDetails.creditCardLimit", creditLimitUpdateRequest.getNewCreditLimit());

            Query query = new Query(Criteria.where("id").is(user.id()));
            mongoTemplate.updateFirst(query, update, User.class);

            return ResponseEntity.ok("Credit card limit updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/user/getCreditCard")
    public ResponseEntity<?> getCreditCard() {
        try {
            CreditCardDetails creditCardDetails = getLoggedInUser().creditCardDetails();
            return ResponseEntity.ok(creditCardDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/user/getDebitCard")
    public ResponseEntity<?> getDebitCard() {
        try {
            DebitCardDetails debitCardDetails = getLoggedInUser().debitCardDetails();
            return ResponseEntity.ok(debitCardDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getUserRole")
    public ResponseEntity<?> getUserRole() {
        try {
            User currentUser = getLoggedInUser();
            Role currentRole = currentUser.roles().get(0);
            return ResponseEntity.ok(currentRole);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/user/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String secret = authenticationService.generateAndSendOTP(email);
        return ResponseEntity.ok("OTP sent to your email.");
    }

    @PostMapping("/user/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> requestData) {
        String email = requestData.get("email");
        String otp = requestData.get("otp");
        String newPassword = requestData.get("newPassword");

        // Validate the OTP again before proceeding
        if (!otpService.validateOTP(email, otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP.");
        }

        // Update the user's password
        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            userService.changeUserPassword(user, newPassword);
            // Optionally, delete the OTP from the database if it's not automatically handled by TTL
            otpService.deleteOTP(email);
            return ResponseEntity.ok("Password has been successfully reset.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    public User getLoggedInUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String userEmail = null;

        if (principal instanceof UserDetails) {
            userEmail = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            userEmail = (String) principal;
        }

        return userRepository.findByEmail(userEmail).orElse(null);
    }
}