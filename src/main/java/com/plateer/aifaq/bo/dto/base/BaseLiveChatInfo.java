package com.plateer.aifaq.bo.dto.base;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@SuperBuilder
public class BaseLiveChatInfo {
    private Long id;
    private Long pgmId;
    private Long parentId;
    private String userId;
    private String userType;
    private String message;
    private LocalDateTime createdAt;
}
