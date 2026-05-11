package com.plateer.aifaq.fo.service;

import com.plateer.aifaq.fo.dto.UserDto;
import com.plateer.aifaq.fo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    @Cacheable(value = "users", key = "'active'")
    public List<UserDto> getActiveUsers() {
        return userRepository.findByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(UserDto::new)
                .toList();
    }
}
