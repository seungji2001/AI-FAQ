package com.plateer.thingz.fo.service;

import com.plateer.thingz.config.JwtTokenProvider;
import com.plateer.thingz.fo.dto.TokenDto;
import com.plateer.thingz.fo.entity.User;
import com.plateer.thingz.fo.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private RefreshTokenService refreshTokenService;

    @Test
    void refreshRotatesTokensUsingCurrentUsername() {
        UUID userId = UUID.randomUUID();
        User user = User.builder().id(userId).username("current-name").isActive(true).build();
        when(jwtTokenProvider.isValid("old-refresh")).thenReturn(true);
        when(jwtTokenProvider.getUserId("old-refresh")).thenReturn(userId);
        when(refreshTokenService.matches(userId, "old-refresh")).thenReturn(true);
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(jwtTokenProvider.createAccessToken(userId, "current-name")).thenReturn("new-access");
        when(jwtTokenProvider.createRefreshToken(userId)).thenReturn("new-refresh");
        AuthService service = new AuthService(userRepository, jwtTokenProvider, passwordEncoder, refreshTokenService);

        TokenDto tokens = service.refresh("old-refresh");

        assertThat(tokens.getAccessToken()).isEqualTo("new-access");
        assertThat(tokens.getRefreshToken()).isEqualTo("new-refresh");
        verify(refreshTokenService).store(userId, "new-refresh");
    }
}
