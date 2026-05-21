import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ArticleListItem } from '../types/article';
import { Colors, FontSize, FontWeight, Radius } from '../styles/theme';

interface Props {
  article: ArticleListItem;
  onPress: () => void;
  featured?: boolean;
}

export default function ArticleCard({ article, onPress, featured }: Props) {
  return (
    <TouchableOpacity style={[styles.card, featured && styles.featured]} onPress={onPress} activeOpacity={0.85}>
      {article.coverUrl ? (
        <Image source={{ uri: article.coverUrl }} style={[styles.image, featured && styles.featuredImage]} />
      ) : (
        <View style={[styles.placeholder, featured && styles.featuredImage]} />
      )}
      <View style={styles.info}>
        {article.tags[0] && <Text style={styles.tag}>#{article.tags[0]}</Text>}
        <Text style={[styles.title, featured && styles.featuredTitle]} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.author}>@{article.author}</Text>
        {article.price != null && (
          <Text style={styles.price}>{article.price.toLocaleString()}원</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.paper,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  featured: {
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.ivoryDark,
  },
  featuredImage: {
    height: 220,
  },
  placeholder: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.ivoryDark,
  },
  info: {
    padding: 12,
    gap: 4,
  },
  tag: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.ink,
    lineHeight: 21,
  },
  featuredTitle: {
    fontSize: FontSize.xl2,
  },
  author: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.ink,
    marginTop: 2,
  },
});
