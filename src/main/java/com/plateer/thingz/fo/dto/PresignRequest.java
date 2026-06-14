package com.plateer.thingz.fo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Schema(description = "S3 presigned URL 요청")
public class PresignRequest {

    @NotBlank(message = "파일명은 필수입니다")
    @Schema(description = "업로드할 파일명", example = "photo.jpg")
    private String fileName;

    @NotBlank(message = "콘텐츠 타입은 필수입니다")
    @Pattern(regexp = "image/(jpeg|jpg|png|gif|webp)", message = "이미지 파일만 업로드 가능합니다")
    @Schema(description = "MIME 타입", example = "image/jpeg")
    private String contentType;
}
