package com.plateer.thingz.fo.service;

import com.plateer.thingz.fo.entity.RefreshToken;
import com.plateer.thingz.fo.repository.RefreshTokenRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository repository;

    @Test
    void storesOnlyAHashOfTheRefreshToken() {
        UUID userId = UUID.randomUUID();
        when(repository.findById(userId)).thenReturn(Optional.empty());
        RefreshTokenService service = new RefreshTokenService(repository);

        service.store(userId, "raw-refresh-token");

        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getTokenHash())
                .hasSize(64)
                .doesNotContain("raw-refresh-token");
    }

    @Test
    void rejectsExpiredRefreshToken() {
        UUID userId = UUID.randomUUID();
        RefreshToken expired = RefreshToken.builder()
                .userId(userId)
                .tokenHash("irrelevant")
                .expiresAt(LocalDateTime.now().minusMinutes(1))
                .updatedAt(LocalDateTime.now())
                .build();
        when(repository.findById(userId)).thenReturn(Optional.of(expired));
        RefreshTokenService service = new RefreshTokenService(repository);

        assertThat(service.matches(userId, "raw-refresh-token")).isFalse();
    }
}
