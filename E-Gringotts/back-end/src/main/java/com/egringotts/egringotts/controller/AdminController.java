package com.egringotts.egringotts.controller;

import com.egringotts.egringotts.entity.AdminDashboardDto;
import com.egringotts.egringotts.entity.CurrencyRateRequest;
import com.egringotts.egringotts.service.CurrencyService;
import com.egringotts.egringotts.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private CurrencyService currencyService;
    private UserService userService;
    private UserController userController;

    @Secured("ROLE_ADMIN")
    @PostMapping("/addCurrency")
    public ResponseEntity<String> addCurrencyRate(@RequestBody CurrencyRateRequest rateRequest) {
        try {
            currencyService.addCurrencyWithRate(rateRequest.getFromCurrency(), rateRequest.getToCurrency(),
                    rateRequest.getRate());
            return ResponseEntity.ok("Rate added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add rate: " + e.getMessage());
        }
    }

    @Secured("ROLE_ADMIN")
    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard() {
        try {
            String userId = userController.getLoggedInUser().id();
            AdminDashboardDto adminDashboardDto = userService.getAdminDashBoard(userId);
            return ResponseEntity.ok(adminDashboardDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
