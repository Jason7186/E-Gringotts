package com.egringotts.egringotts.controller;

import com.egringotts.egringotts.entity.DepositRequest;
import com.egringotts.egringotts.entity.FriendRequest;
import com.egringotts.egringotts.entity.TransferRequest;
import com.egringotts.egringotts.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login-transaction")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/instant-transfer")
    public ResponseEntity<?> handleInstantTransfer (@RequestBody TransferRequest transferRequest) {
        try {
            transactionService.instantTransfer(transferRequest.getReceiverAccountId(), transferRequest.getAmount(), transferRequest.getCategory(),transferRequest.getTransactionDetails());
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> handleDeposit (@RequestBody DepositRequest depositRequest) {
        try {
            transactionService.deposit(depositRequest.getAmount());
            return ResponseEntity.ok("Deposit Successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/friends/{accountId}")
    public ResponseEntity<?> searchUserByAccountId(@PathVariable String accountId) {
        try {
            String userName = transactionService.findUserNameByAccountId(accountId);
            return ResponseEntity.ok(userName);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PostMapping("/friends")
    public ResponseEntity<?> addFriend(@RequestBody FriendRequest friendRequest) {
        try {
            transactionService.addFriend(friendRequest.getAccountId());
            return ResponseEntity.ok("Friend added successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/friends/{friendAccountId}")
    public ResponseEntity<?> deleteFriend(@PathVariable String friendAccountId) {
        try {
            transactionService.deleteFriend(friendAccountId);
            return ResponseEntity.ok("Delete Successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
