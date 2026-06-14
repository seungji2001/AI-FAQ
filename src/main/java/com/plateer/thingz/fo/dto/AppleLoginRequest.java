package com.plateer.thingz.fo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class AppleLoginRequest {

    @NotBlank
    private String identityToken;

    private String fullName;
}
