package com.plateer.thingz.fo.entity;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class UserTest {

    @Test
    void deactivateRemovesPersonalIdentifiers() {
        User user = User.builder()
                .id(UUID.randomUUID())
                .username("person")
                .displayName("Person")
                .email("person@example.com")
                .kakaoId(123L)
                .appleId("apple-id")
                .password("encoded-password")
                .isActive(true)
                .build();

        user.deactivate();

        assertThat(user.getIsActive()).isFalse();
        assertThat(user.getUsername()).startsWith("deleted_");
        assertThat(user.getEmail()).isNull();
        assertThat(user.getKakaoId()).isNull();
        assertThat(user.getAppleId()).isNull();
        assertThat(user.getPassword()).isNull();
    }
}
