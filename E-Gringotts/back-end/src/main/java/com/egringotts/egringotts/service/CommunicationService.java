package com.egringotts.egringotts.service;

import com.egringotts.egringotts.entity.Transaction;
import com.egringotts.egringotts.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class CommunicationService {

    private final JavaMailSender javaMailSender;

    public CommunicationService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendInvoiceEmail(User user, Transaction newTransaction, double newAmount) throws Exception {
        String pdfInvoice = createPdfInvoice(user, newTransaction, newAmount);
        sendEmailWithAttachment(user.email(), pdfInvoice);
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

        return pdfInvoice;    }

    private void sendEmailWithAttachment(String email, String pdfInvoice) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);
        helper.setSubject("Deposit Invoice");
        helper.setText("Please find the attached the invoice for your recent deposit" ,true);
        helper.addAttachment("invoice.pdf", new File(pdfInvoice));
        javaMailSender.send(message);
    }
}