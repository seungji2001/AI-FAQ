package com.plateer.thingz.fo.controller;

import com.plateer.thingz.config.auth.CustomOAuth2User;
import com.plateer.thingz.fo.dto.ContentReportRequest;
import com.plateer.thingz.fo.service.ContentReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/fo/articles/{articleId}/reports")
@RequiredArgsConstructor
public class ContentReportController {

    private final ContentReportService contentReportService;

    @PostMapping
    public ResponseEntity<Void> report(
            @PathVariable UUID articleId,
            @Valid @RequestBody ContentReportRequest request,
            @AuthenticationPrincipal CustomOAuth2User user
    ) {
        UUID reportId = contentReportService.report(articleId, user.getUserId(), request.getReason());
        return ResponseEntity.created(URI.create("/api/fo/reports/" + reportId)).build();
    }
}
