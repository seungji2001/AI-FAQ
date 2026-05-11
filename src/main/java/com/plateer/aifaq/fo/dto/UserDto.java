package com.plateer.aifaq.fo.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.plateer.aifaq.fo.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Getter
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class UserDto {
    private UUID id;
    private String username;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private int articleCount;

    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.bio = user.getBio();
        this.avatarUrl = user.getAvatarUrl();
        this.articleCount = user.getArticles().size();
    }
}
