package com.plateer.thingz.fo.service;

import com.plateer.thingz.fo.entity.Article;
import com.plateer.thingz.fo.entity.ContentReport;
import com.plateer.thingz.fo.entity.User;
import com.plateer.thingz.fo.repository.ArticleRepository;
import com.plateer.thingz.fo.repository.ContentReportRepository;
import com.plateer.thingz.fo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContentReportService {

    private final ContentReportRepository contentReportRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    @Transactional
    public UUID report(UUID articleId, UUID reporterId, String reason) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new EntityNotFoundException("Article not found: " + articleId));
        if (article.getUser().getId().equals(reporterId)) {
            throw new IllegalArgumentException("자신의 아티클은 신고할 수 없습니다.");
        }
        if (contentReportRepository.existsByReporterIdAndArticleId(reporterId, articleId)) {
            throw new IllegalArgumentException("이미 신고한 아티클입니다.");
        }

        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + reporterId));
        ContentReport report = contentReportRepository.save(ContentReport.builder()
                .article(article)
                .reporter(reporter)
                .reason(reason.trim())
                .build());
        return report.getId();
    }
}
