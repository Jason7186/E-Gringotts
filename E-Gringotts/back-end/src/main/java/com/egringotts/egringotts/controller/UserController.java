package com.egringotts.egringotts.controller;


import com.egringotts.egringotts.config.JwtHelper;
import com.egringotts.egringotts.entity.LoginDto;
import com.egringotts.egringotts.entity.LoginResponse;
import com.egringotts.egringotts.entity.User;
import com.egringotts.egringotts.entity.UserDto;
import com.egringotts.egringotts.repository.UserRepository;
import com.egringotts.egringotts.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        try {
            if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exist. Please enter another one");
            }

            User newUser = userService.registerUser(userDto);

            // Authenticate the user immediately after registration
            UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(userDto.getEmail(), userDto.getPassword());
            Authentication auth = authenticationManager.authenticate(authReq);
            SecurityContextHolder.getContext().setAuthentication(auth);

            return ResponseEntity.ok(HttpStatus.CREATED);
        }catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginDto loginDto) {
        try {
            UsernamePasswordAuthenticationToken authReq = new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword());
            Authentication auth = authenticationManager.authenticate(authReq);
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = JwtHelper.generateToken(loginDto.getEmail());
            return ResponseEntity.ok(new LoginResponse(loginDto.getEmail(), token));
        } catch (AuthenticationException e) {
            // This should return a ResponseEntity with an appropriate type that can handle error strings.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(null, "Login failed"));
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