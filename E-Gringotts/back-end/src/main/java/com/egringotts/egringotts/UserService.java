package com.egringotts.egringotts;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.File;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Optional;

import static org.springframework.data.mongodb.core.query.Criteria.where;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoClient mongoClient;
    private final MongoTemplate mongoTemplate;
    private final JavaMailSender javaMailSender;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, MongoClient mongoClient, MongoTemplate mongoTemplate, JavaMailSender javaMailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mongoClient = mongoClient;
        this.mongoTemplate = mongoTemplate;
        this.javaMailSender = javaMailSender;
    }

    public User registerUser(UserDto userDto) {
        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        User user = new User(
                null, // MongoDB generates the ID
                userDto.getName(),
                calculateAge(userDto.getDateOfBirth()),
                generateAccountId(),
                userDto.getDateOfBirth(),
                userDto.getEmail(),
                encodedPassword,
                0, // Initial available amount
                "Silver Snitch", // Default user tier
                userDto.getSecurityPin(),
                new DebitCardDetails(),
                new CreditCardDetails(),
                new ArrayList<Transaction>()
        );
        return userRepository.save(user);
    }

    private String generateAccountId() {
        MongoDatabase database = mongoClient.getDatabase("bank-api-db");
        MongoCollection<Document> collection = database.getCollection("userInfo");

        // Find the most recent user document with account ID
        Document doc = collection.find().sort(new Document("accountId", -1)).first();

        String lastAccountId = "23000000";
        if (doc != null) {
            lastAccountId = doc.getString("accountId");
        }
        int newAccId = Integer.parseInt(lastAccountId) + 1;
        return String.format("%08d", newAccId);
    }


    private int calculateAge(LocalDate dateOfBirth) {
        return (LocalDate.now().getYear() - dateOfBirth.getYear());
    }

    public Optional<User> loginUser(UserDto userDto) {
        Optional<User> optionalUser = userRepository.findByEmail(userDto.getEmail());

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            boolean passwordMatches = passwordEncoder.matches(userDto.getPassword(), user.password());
            boolean pinMatches = userDto.getSecurityPin().equals(user.securityPin());

            if (passwordMatches && pinMatches) return Optional.of(user);
        }
        return Optional.empty();
    }

    public void addTransaction(String accountId, Transaction newTransaction) {
        Query query = new Query(where("accountId").is(accountId));
        Update update = new Update().addToSet("transactions",newTransaction);
        mongoTemplate.updateFirst(query, update, User.class);
    }

    public void deposit(String accountId, Double amount) throws Exception {
        Optional<User> userOpt = userRepository.findByAccountId(accountId);
        //need verify existence of accountId

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            double newAmount = user.availableAmount() + amount;
            Transaction newTransaction = new Transaction(amount, "deposit", "", "", "", "", "", "");
            Query query = new Query(where("accountId").is(accountId));
            Update update = new Update().set("availableAmount", newAmount).addToSet("transactions", newTransaction);
            mongoTemplate.updateFirst(query, update, User.class);

            sendInvoiceEmail(user, newTransaction, newAmount);

        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void instantTransfer (String accountId, Double amount, String sender, String senderId, String receiver, String receiverId, String category) {
        Optional<User> userOpt = userRepository.findByAccountId(accountId);

    }

    private void sendInvoiceEmail(User user, Transaction newTransaction, double newAmount) throws Exception {
        try {
            String pdfInvoice = createPdfInvoice(user, newTransaction, newAmount);
            sendEmailWithAttachment(user.email(), pdfInvoice);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String createPdfInvoice(User user, Transaction newTransaction, double newAmount) throws Exception {
        String pdfInvoice = "/mnt/data/invoice-" + newTransaction.getTransactionId() + ".pdf";
        PDDocument document = new PDDocument();
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);

        PDPageContentStream contentStream = new PDPageContentStream(document, page);
        contentStream.setFont(PDType1Font.HELVETICA, 12);
        contentStream.beginText();
        contentStream.newLineAtOffset(100, 700);
        contentStream.showText("Invoice");
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Transaction ID: " + newTransaction.getTransactionId());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Date: " + newTransaction.getDateTime());
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("Amount: " + newTransaction.getAmount() + "Galleon");
        contentStream.newLineAtOffset(0, -20);
        contentStream.showText("New Available Balance: " + newAmount + "Galleon");
        contentStream.endText();
        contentStream.close();

        document.save(pdfInvoice);
        document.close();

        return pdfInvoice;
    }

    private void sendEmailWithAttachment(String email, String pdfInvoice) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);
        helper.setSubject("Deposit Invoice");
        helper.setText("Please find the attached the invoice for your recent deposit" ,true);
        helper.addAttachment("invoice.pdf", new File(pdfInvoice));
        javaMailSender.send(message);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        String currentPrincipalName = authentication.getName();
        return userRepository.findByEmail(currentPrincipalName).orElse(null);
    }


}
