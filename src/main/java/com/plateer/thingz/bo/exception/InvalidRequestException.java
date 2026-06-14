package com.plateer.thingz.bo.exception;

import com.plateer.thingz.bo.enums.ErrorCode;

public class InvalidRequestException extends BusinessException {
    public InvalidRequestException(String message) {
        super(ErrorCode.INVALID_REQUEST, message);
    }

    public InvalidRequestException(ErrorCode errorCode) {
        super(errorCode);
    }
}
