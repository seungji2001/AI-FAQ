package com.plateer.thingz.fo.controller;

import com.plateer.thingz.fo.dto.PresignRequest;
import com.plateer.thingz.fo.dto.PresignResponse;
import com.plateer.thingz.fo.service.S3Service;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Upload", description = "이미지 업로드 API")
@RestController
@RequestMapping("/api/fo/upload")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @Operation(
        summary = "S3 presigned URL 발급",
        description = "클라이언트가 S3에 직접 이미지를 업로드하기 위한 presigned URL을 발급합니다. " +
                      "발급된 presignedUrl로 PUT 요청하여 업로드하고, fileUrl을 아티클에 저장하세요.",
        responses = {
            @ApiResponse(responseCode = "200", description = "발급 성공"),
            @ApiResponse(responseCode = "400", description = "이미지 파일만 허용")
        }
    )
    @PostMapping("/presign")
    public ResponseEntity<PresignResponse> getPresignedUrl(@Valid @RequestBody PresignRequest request) {
        return ResponseEntity.ok(s3Service.generatePresignedUrl(request.getFileName(), request.getContentType()));
    }
}
