package com.plateer.aifaq.bo.exception;

import com.plateer.aifaq.bo.enums.ErrorCode;

public class InvalidRequestException extends BusinessException {
    public InvalidRequestException(String message) {
        super(ErrorCode.INVALID_REQUEST, message);
    }

    public InvalidRequestException(ErrorCode errorCode) {
        super(errorCode);
    }
}
