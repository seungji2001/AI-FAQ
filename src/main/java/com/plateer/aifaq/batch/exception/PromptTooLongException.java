package com.plateer.aifaq.batch.exception;

public class PromptTooLongException extends RuntimeException {
    public PromptTooLongException(String message) {
        super(message);
    }
}