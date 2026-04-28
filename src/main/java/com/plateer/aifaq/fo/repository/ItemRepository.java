package com.plateer.aifaq.fo.repository;

import com.plateer.aifaq.fo.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {
}
