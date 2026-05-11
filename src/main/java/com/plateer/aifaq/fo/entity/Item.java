package com.plateer.aifaq.fo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
@AllArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", unique = true, nullable = false)
    private Article article;

    private Integer price;

    @Column(name = "item_condition", length = 2)
    private String condition;

    @Column(length = 10)
    private String tradeType;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isSold = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void markAsSold() {
        this.isSold = true;
    }
}
