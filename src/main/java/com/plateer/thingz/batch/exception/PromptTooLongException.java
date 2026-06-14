package com.plateer.thingz.batch.exception;

public class PromptTooLongException extends RuntimeException {
    public PromptTooLongException(String message) {
        super(message);
    }
}