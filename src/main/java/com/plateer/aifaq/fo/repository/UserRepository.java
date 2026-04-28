package com.plateer.aifaq.fo.repository;

import com.plateer.aifaq.fo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    List<User> findByIsActiveTrueOrderByCreatedAtDesc();
}
