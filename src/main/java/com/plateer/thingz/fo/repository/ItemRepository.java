package com.plateer.thingz.fo.repository;

import com.plateer.thingz.fo.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {
}
