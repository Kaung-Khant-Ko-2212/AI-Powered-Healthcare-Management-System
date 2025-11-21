package com.ezhealthcare.EZHealthcare.controller;

public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}