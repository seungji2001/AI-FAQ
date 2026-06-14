package com.plateer.thingz.config.auth;

import com.plateer.thingz.fo.entity.User;
import com.plateer.thingz.fo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(request);
        Map<String, Object> attributes = oauth2User.getAttributes();

        Long kakaoId = ((Number) attributes.get("id")).longValue();

        @SuppressWarnings("unchecked")
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        @SuppressWarnings("unchecked")
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String nickname = (String) profile.get("nickname");
        String avatarUrl = (String) profile.get("profile_image_url");

        User user = userRepository.findByKakaoId(kakaoId)
                .map(existing -> updateUser(existing, nickname, avatarUrl))
                .orElseGet(() -> createUser(kakaoId, nickname, avatarUrl));

        return new CustomOAuth2User(user, attributes);
    }

    private User createUser(Long kakaoId, String nickname, String avatarUrl) {
        User user = User.builder()
                .kakaoId(kakaoId)
                .username("kakao_" + kakaoId)
                .displayName(nickname)
                .avatarUrl(avatarUrl)
                .isActive(true)
                .build();
        return userRepository.save(user);
    }

    private User updateUser(User user, String nickname, String avatarUrl) {
        user.updateProfile(nickname, avatarUrl);
        return user;
    }
}
