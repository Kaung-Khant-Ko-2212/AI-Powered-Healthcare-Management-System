package com.ezhealthcare.EZHealthcare.exception;

public class AppointmentLimitExceededException extends RuntimeException {
    public AppointmentLimitExceededException(String message) {
        super(message);
    }
}
