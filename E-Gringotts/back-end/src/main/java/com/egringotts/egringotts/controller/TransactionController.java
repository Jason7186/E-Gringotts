package com.egringotts.egringotts.controller;

import com.egringotts.egringotts.entity.*;
import com.egringotts.egringotts.service.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/login-transaction")
public class TransactionController {
    private final TransactionService transactionService;
    private final UserController userController;

    @GetMapping("/check-balance")
    public ResponseEntity<?> checkCurrentAccountBalance() {
        try {
            User currentUser = userController.getLoggedInUser();
            double balance = currentUser.availableAmount();
            return ResponseEntity.ok(balance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/instant-transfer")
    public ResponseEntity<?> handleInstantTransfer(@RequestBody TransferRequest transferRequest) {
        try {
            transactionService.instantTransfer(transferRequest.getReceiverAccountId(), transferRequest.getAmount(),
                    transferRequest.getCategory(), transferRequest.getTransactionDetails(),
                    transferRequest.getSecurityPin());
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> handleDeposit(@RequestBody DepositRequest depositRequest) {
        try {
            transactionService.deposit(depositRequest.getAmount(), depositRequest.getSecurityPin());
            return ResponseEntity.ok("Deposit Successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/searchId/{accountId}")
    public ResponseEntity<?> searchUserByAccountId(@PathVariable String accountId) {
        try {
            String userName = transactionService.findUserNameByAccountId(accountId);
            return ResponseEntity.ok(Collections.singletonMap("userName", userName));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @GetMapping("/retrieveFriends")
    public ResponseEntity<?> currentLoggedInUserFriends() {
        try {
            User user = userController.getLoggedInUser();
            List<Friend> friendList = user.friends();
            return ResponseEntity.ok(friendList);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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

    @PostMapping("/oversea-transfer")
    public ResponseEntity<?> handleOverseaTransfer(@RequestBody OverseaTransferRequest overseaTransferRequest) {
        try {
            transactionService.overseaTransfer(overseaTransferRequest);
            return ResponseEntity.ok("Oversea transfer successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/transaction-history")
    public ResponseEntity<?> getTransactionHistory(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) List<String> type,
            @RequestParam(required = false) List<String> category) {
        try {
            List<Transaction> transactions = transactionService.getTransactionsByAccountId(startDate, endDate, type,
                    category);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}