package com.plateer.aifaq.fo.dto;

import com.plateer.aifaq.fo.entity.User;
import lombok.Getter;

import java.util.UUID;

@Getter
public class UserDto {
    private final UUID id;
    private final String username;
    private final String displayName;
    private final String bio;
    private final String avatarUrl;
    private final int articleCount;

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.bio = user.getBio();
        this.avatarUrl = user.getAvatarUrl();
        this.articleCount = user.getArticles().size();
    }
}
