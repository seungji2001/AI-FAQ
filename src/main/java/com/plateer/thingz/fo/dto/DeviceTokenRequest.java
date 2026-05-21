package com.plateer.thingz.fo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class DeviceTokenRequest {

    @NotBlank
    private String token;

    private String platform = "ios";
}
