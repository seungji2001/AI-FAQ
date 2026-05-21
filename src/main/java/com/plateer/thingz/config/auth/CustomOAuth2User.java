package com.plateer.thingz.config.auth;

import com.plateer.thingz.fo.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class CustomOAuth2User implements OAuth2User {

    private final UUID userId;
    private final String username;
    private final Map<String, Object> attributes;

    public CustomOAuth2User(UUID userId, String username) {
        this.userId = userId;
        this.username = username;
        this.attributes = Map.of();
    }

    public CustomOAuth2User(User user, Map<String, Object> attributes) {
        this.userId = user.getId();
        this.username = user.getUsername();
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() { return attributes; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getName() { return userId.toString(); }

    public UUID getUserId() { return userId; }
    public String getUsername() { return username; }
}
