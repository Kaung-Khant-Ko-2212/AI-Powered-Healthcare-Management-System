package com.ezhealthcare.EZHealthcare.exception;

public class DuplicateAppointmentException extends RuntimeException {
    public DuplicateAppointmentException(String message) {
        super(message);
    }
}
