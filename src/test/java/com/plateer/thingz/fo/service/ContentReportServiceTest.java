package com.plateer.thingz.fo.service;

import com.plateer.thingz.fo.entity.Article;
import com.plateer.thingz.fo.entity.User;
import com.plateer.thingz.fo.repository.ArticleRepository;
import com.plateer.thingz.fo.repository.ContentReportRepository;
import com.plateer.thingz.fo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContentReportServiceTest {

    @Mock
    private ContentReportRepository reportRepository;
    @Mock
    private ArticleRepository articleRepository;
    @Mock
    private UserRepository userRepository;

    @Test
    void articleOwnerCannotReportOwnArticle() {
        UUID ownerId = UUID.randomUUID();
        UUID articleId = UUID.randomUUID();
        User owner = User.builder().id(ownerId).username("owner").isActive(true).build();
        Article article = Article.builder().id(articleId).user(owner).title("title").build();
        when(articleRepository.findById(articleId)).thenReturn(Optional.of(article));
        ContentReportService service = new ContentReportService(reportRepository, articleRepository, userRepository);

        assertThatThrownBy(() -> service.report(articleId, ownerId, "reason"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("자신의 아티클");
    }

    @Test
    void duplicateReportIsRejected() {
        UUID ownerId = UUID.randomUUID();
        UUID reporterId = UUID.randomUUID();
        UUID articleId = UUID.randomUUID();
        User owner = User.builder().id(ownerId).username("owner").isActive(true).build();
        Article article = Article.builder().id(articleId).user(owner).title("title").build();
        when(articleRepository.findById(articleId)).thenReturn(Optional.of(article));
        when(reportRepository.existsByReporterIdAndArticleId(reporterId, articleId)).thenReturn(true);
        ContentReportService service = new ContentReportService(reportRepository, articleRepository, userRepository);

        assertThatThrownBy(() -> service.report(articleId, reporterId, "reason"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("이미 신고");
    }
}
