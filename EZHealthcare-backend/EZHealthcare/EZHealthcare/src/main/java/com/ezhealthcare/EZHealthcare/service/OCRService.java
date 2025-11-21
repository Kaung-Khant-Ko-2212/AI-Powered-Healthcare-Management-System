package com.ezhealthcare.EZHealthcare.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Service
public class OCRService {

    private final String tessDataPath = "C:\\Program Files\\Tesseract-OCR\\tessdata"; // Update with your Tesseract path

    public String extractTextFromPDF(MultipartFile file) throws IOException {
        StringBuilder extractedText = new StringBuilder();

        try (InputStream inputStream = file.getInputStream()) {
            PDDocument document = PDDocument.load(inputStream);
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath(tessDataPath);

            for (int page = 0; page < document.getNumberOfPages(); page++) {
                BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
                File tempFile = File.createTempFile("ocr_temp", ".png");
                ImageIO.write(image, "png", tempFile);

                try {
                    String pageText = tesseract.doOCR(tempFile).trim();
                    if (!pageText.isEmpty()) {
                        extractedText.append(pageText).append("\n");
                    }
                } catch (TesseractException e) {
                    System.err.println("Error processing page " + (page + 1) + ": " + e.getMessage());
                }
                tempFile.delete();
            }
            document.close();
        }

        return extractedText.length() == 0 ? "No text extracted." : extractedText.toString();
    }

    public String extractTextFromImage(MultipartFile file) throws IOException {
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath(tessDataPath);

        try (InputStream inputStream = file.getInputStream()) {
            BufferedImage image = ImageIO.read(inputStream);
            return tesseract.doOCR(image).trim();
        } catch (TesseractException e) {
            throw new IOException("Error processing image with OCR: " + e.getMessage(), e);
        }
    }
}
