package com.augusto.login_system.common;

public class DuplicateDataException extends RuntimeException {
    public DuplicateDataException(String message) { super(message); }
}