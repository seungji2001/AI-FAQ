package com.plateer.aifaq.batch.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum LinkStatus {
    W("대기", "Wait"),
    A("활성", "Active"),
    F("실패", "Failed");

    private final String korean;
    private final String english;

    // String → Enum 변환
    public static LinkStatus fromValue(String value) {
        for (LinkStatus status : values()) {
            if (status.name().equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown LinkStatus: " + value);
    }
}
