package com.plateer.thingz.fo.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.plateer.thingz.fo.entity.User;
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
    private long followerCount;
    private long followingCount;

    private String coverUrl;
    private String instagramId;
    private String kakaoUrl;

    public UserDto(User user, long followerCount, long followingCount) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
        this.bio = user.getBio();
        this.avatarUrl = user.getAvatarUrl();
        this.articleCount = user.getArticles().size();
        this.followerCount = followerCount;
        this.followingCount = followingCount;
        this.coverUrl = user.getCoverUrl();
        this.instagramId = user.getInstagramId();
        this.kakaoUrl = user.getKakaoUrl();
    }
}
