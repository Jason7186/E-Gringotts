package com.egringotts.egringotts;

import com.egringotts.egringotts.*;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JavaMailSender javaMailSender;

    @Test
    public void testDeposit() throws Exception {
        // Arrange
        User user = new User(
                "1", "John Doe", 30, "23000001",
                LocalDate.of(1991, 1, 1), "hongyu6776@gmail.com",
                "hashed_password", 1000,
                "Silver Snitch", "123456",
                new DebitCardDetails(),
                new CreditCardDetails(),
                new ArrayList<>()
        );

        when(userRepository.findByAccountId("23000001")).thenReturn(Optional.of(user));

        // Act
        userService.deposit("23000001", 500.0);

        // Assert
        verify(userRepository).save(any(User.class));
        verify(javaMailSender).send(any(MimeMessage.class));
    }
}
