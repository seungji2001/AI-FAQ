package com.plateer.aifaq.batch.dto;

import com.plateer.aifaq.batch.dto.base.BaseFaqSumrInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class FaqSumrInfo extends BaseFaqSumrInfo {
    private String userMsg;
    private String pdMsg;
}
