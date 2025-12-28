package com.plateer.aifaq.bo.exception;

import com.plateer.aifaq.bo.enums.ErrorCode;

public class ResourceNotFoundException extends BusinessException {
    public ResourceNotFoundException(String resource, Long id) {
        super(ErrorCode.RESOURCE_NOT_FOUND,
                String.format("%s를 찾을 수 없습니다. ID: %d", resource, id));
    }

    public ResourceNotFoundException(String resource) {
        super(ErrorCode.RESOURCE_NOT_FOUND, resource);
    }

    public ResourceNotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }
}
