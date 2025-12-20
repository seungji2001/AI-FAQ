package com.plateer.aifaq.bo.dto;

import com.plateer.aifaq.bo.dto.base.BaseLiveChatInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class LiveChatInfo extends BaseLiveChatInfo {
    private String pdMsg;
    private String userMsg;
}
