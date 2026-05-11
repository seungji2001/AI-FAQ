package com.plateer.aifaq.fo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "유저 프로필 수정 요청")
public class UserUpdateRequest {

    @Schema(description = "표시 이름")
    private String displayName;

    @Schema(description = "소개글")
    private String bio;

    @Schema(description = "인스타그램 ID")
    private String instagramId;

    @Schema(description = "카카오 오픈채팅 링크")
    private String kakaoUrl;
}
