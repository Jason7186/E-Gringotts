package com.egringotts.egringotts.service;

import com.egringotts.egringotts.entity.OverseaTransferRequest;
import com.egringotts.egringotts.entity.Transaction;
import com.egringotts.egringotts.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

@Service
public class CommunicationService {

    private final JavaMailSender javaMailSender;
    private final CurrencyService currencyService;
    private static final Logger logger = LoggerFactory.getLogger(CommunicationService.class);

    public CommunicationService(JavaMailSender javaMailSender, CurrencyService currencyService) {
        this.javaMailSender = javaMailSender;
        this.currencyService = currencyService;
    }

    public void sendInvoiceEmail(User user, Transaction newTransaction, double newAmount,
            OverseaTransferRequest overseaTransferRequest) {
        String pdfInvoice = null;
        try {
            pdfInvoice = createPdfInvoice(newTransaction, newAmount, overseaTransferRequest);
            sendEmailWithAttachment(newTransaction, user.email(), pdfInvoice);
        } catch (Exception e) {
            logger.error("Error in sending invoice email: ", e);
            throw new RuntimeException("Failed to send invoice email", e);
        } finally {
            if (pdfInvoice != null) {
                // Clean up the generated PDF file
                File file = new File(pdfInvoice);
                if (file.exists()) {
                    file.delete();
                }
            }
        }
    }

    public String createPdfInvoice(Transaction transaction, double newBalance,
            OverseaTransferRequest overseaTransferRequest) throws IOException {
        String pdfInvoice = "C:\\Users\\Teoh Jia Yong\\OneDrive\\Desktop\\E Gringotts PDF"
                + transaction.getTransactionId() + ".pdf";
        PDDocument document = new PDDocument();
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);

        // Load fonts and images
        PDType0Font fontRegular = PDType0Font.load(document, new File(
                "C:\\Users\\Teoh Jia Yong\\OneDrive\\Desktop\\E Gringotts PDF\\Roboto-Regular.ttf"));
        PDType0Font fontBold = PDType0Font.load(document, new File(
                "C:\\Users\\Teoh Jia Yong\\OneDrive\\Desktop\\E Gringotts PDF\\Roboto-Bold.ttf"));
        PDImageXObject logo = PDImageXObject.createFromFile(
                "C:\\Users\\Teoh Jia Yong\\OneDrive\\Desktop\\E Gringotts PDF\\E-gringotts logo.png",
                document);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMMM yyyy HH:mm:ss");
        DecimalFormat df = new DecimalFormat("#.00"); // Decimal formatter for currency values

        try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
            // Logo and header
            contentStream.drawImage(logo, 50, 750, 100, 50);
            contentStream.beginText();
            contentStream.setFont(fontBold, 18);
            contentStream.newLineAtOffset(200, 770);
            contentStream.showText("E-gringotts");
            contentStream.endText();

            // Subheader
            contentStream.beginText();
            contentStream.setFont(fontRegular, 12);
            contentStream.newLineAtOffset(200, 750);
            contentStream.showText("Your only digital bank in the wizarding world");
            contentStream.endText();

            // Invoice and transaction details
            contentStream.beginText();
            contentStream.setFont(fontBold, 16);
            contentStream.newLineAtOffset(50, 700);
            contentStream.showText("Invoice - " + transaction.getType());
            contentStream.endText();

            contentStream.beginText();
            contentStream.setFont(fontRegular, 12);
            contentStream.newLineAtOffset(50, 680);
            contentStream.showText("Transaction ID: " + transaction.getTransactionId());
            contentStream.newLineAtOffset(0, -20);
            String formattedDate = transaction.getDateTime().format(formatter);
            contentStream.showText("Date: " + formattedDate);

            if (transaction.getType().equals("Oversea Transfer")) {
                double convertedAmount = currencyService.convertCurrency(overseaTransferRequest.getBaseCurrency(),
                        overseaTransferRequest.getToCurrency(), overseaTransferRequest.getAmount());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Amount: " + df.format(overseaTransferRequest.getAmount()) + " "
                        + overseaTransferRequest.getBaseCurrency());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("From Currency: " + overseaTransferRequest.getBaseCurrency());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("To Currency: " + overseaTransferRequest.getToCurrency());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Initial Currency Amount: " + df.format(overseaTransferRequest.getAmount()) + " "
                        + overseaTransferRequest.getBaseCurrency());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("After Conversion Amount: " + df.format(convertedAmount) + " "
                        + overseaTransferRequest.getToCurrency());
            } else {
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Amount: " + df.format(transaction.getAmount()) + " Galleon");
            }

            contentStream.newLineAtOffset(0, -20);
            contentStream.showText("New Available Balance: " + df.format(newBalance) + " Galleon");

            contentStream.newLineAtOffset(0, -20);
            contentStream.showText("From: " + transaction.getSender() + " (" + transaction.getSenderId() + ")");
            contentStream.newLineAtOffset(0, -20);
            contentStream.showText("To: " + transaction.getReceiver() + " (" + transaction.getReceiverId() + ")");
            contentStream.newLineAtOffset(0, -20);
            contentStream.showText("Category: " + transaction.getCategory());
            contentStream.newLineAtOffset(0, -20);
            contentStream.showText("Transaction Details: " + transaction.getDetails());
            contentStream.endText();

            // Footer
            contentStream.beginText();
            contentStream.setFont(fontRegular, 10);
            contentStream.newLineAtOffset(50, 50);
            contentStream.showText("Thank you for banking with us.");
            contentStream.newLineAtOffset(0, -20);
            contentStream.showText("011-10698861 | https://e-gringotts.com");
            contentStream.endText();
        }

        document.save(pdfInvoice);
        document.close();
        return pdfInvoice;
    }

    private void sendEmailWithAttachment(Transaction transaction, String email, String pdfInvoice)
            throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);

        switch (transaction.getType()) {
            case "Deposit" -> helper.setSubject("Deposit Invoice");
            case "Instant Transfer" -> helper.setSubject("Transfer Invoice");
            case "Oversea Transfer" -> helper.setSubject("Oversea Transfer Invoice");
        }

        switch (transaction.getType()) {
            case "Deposit" -> helper.setText("Please find attached the invoice for your recent deposit.", true);
            case "Instant Transfer" ->
                helper.setText("Please find attached the invoice for your recent transfer.", true);
            case "Oversea Transfer" ->
                helper.setText("Please find attached the invoice for your recent oversea transfer.", true);
        }

        File attachment = new File(pdfInvoice);
        if (!attachment.exists()) {
            throw new MessagingException("Invoice file not found: " + pdfInvoice);
        }

        helper.addAttachment("invoice.pdf", attachment);

        javaMailSender.send(message);
    }

}