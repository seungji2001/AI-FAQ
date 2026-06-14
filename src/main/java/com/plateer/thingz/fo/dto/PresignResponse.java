package com.plateer.thingz.fo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Schema(description = "S3 presigned URL 응답")
public class PresignResponse {

    @Schema(description = "S3에 직접 PUT 업로드할 presigned URL (10분 유효)")
    private String presignedUrl;

    @Schema(description = "업로드 완료 후 아티클에 저장할 최종 이미지 URL")
    private String fileUrl;
}
