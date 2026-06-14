package com.plateer.thingz.fo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(length = 100)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String coverUrl;

    @Column(length = 100)
    private String instagramId;

    @Column(columnDefinition = "TEXT")
    private String kakaoUrl;

    @Column(unique = true)
    private Long kakaoId;

    @Column(unique = true, length = 100)
    private String appleId;

    @Column(unique = true, length = 100)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String password;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @BatchSize(size = 100)
    @Builder.Default
    private List<Article> articles = new ArrayList<>();

    public void updateProfile(String displayName, String avatarUrl) {
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
    }

    public void editProfile(String displayName, String bio, String instagramId, String kakaoUrl) {
        if (displayName != null) this.displayName = displayName;
        if (bio != null) this.bio = bio;
        if (instagramId != null) this.instagramId = instagramId;
        if (kakaoUrl != null) this.kakaoUrl = kakaoUrl;
    }

    public void updateAvatar(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
