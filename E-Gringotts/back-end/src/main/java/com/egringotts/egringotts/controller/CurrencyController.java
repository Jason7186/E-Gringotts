package com.egringotts.egringotts.controller;

import com.egringotts.egringotts.entity.CurrencyRateRequest;
import com.egringotts.egringotts.service.CurrencyService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/admin")
public class CurrencyController {

    private CurrencyService currencyService;

    @Secured("ROLE_ADMIN")
    @PostMapping("/addCurrency")
    public ResponseEntity<String> addCurrencyRate(@RequestBody CurrencyRateRequest rateRequest) {
        try {
            currencyService.addCurrencyWithRate(rateRequest.getFromCurrency(), rateRequest.getToCurrency(), rateRequest.getRate());
            return ResponseEntity.ok("Rate added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add rate: " + e.getMessage());
        }
    }

}
