import { Colors, FontSize, FontWeight, Radius } from '../styles/theme';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArticleService } from '../core/services/ArticleService';
import { UserService } from '../core/services/UserService';
import { ArticleDetail } from '../types/article';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'ArticleDetail'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ArticleDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { id } = route.params;
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ArticleService.fetchOne(id)
      .then(async (a) => {
        setArticle(a);
        if (a.authorId) {
          const res = await UserService.checkFollowing(a.authorId).catch(() => ({ following: false }));
          setIsFollowing(res.following);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFollow = async () => {
    if (!article) return;
    try {
      if (isFollowing) {
        await UserService.unfollow(article.authorId);
        setIsFollowing(false);
      } else {
        await UserService.follow(article.authorId);
        setIsFollowing(true);
      }
    } catch {}
  };

  const handleMarkSold = () => {
    Alert.alert('판매완료', '판매완료 처리할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '확인', onPress: async () => {
        await ArticleService.markSold(id).catch(() => {});
        setArticle(prev => prev && prev.item ? { ...prev, item: { ...prev.item, isSold: true } } : prev);
      }},
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!article) return <View style={styles.center}><Text>글을 찾을 수 없습니다.</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 태그 & 제목 */}
      {article.tags[0] && <Text style={styles.tag}>#{article.tags[0]}</Text>}
      <Text style={styles.title}>{article.title}</Text>

      {/* 작성자 + 날짜 */}
      <View style={styles.metaRow}>
        {article.authorAvatarUrl ? (
          <Image source={{ uri: article.authorAvatarUrl }} style={styles.metaAvatar} />
        ) : (
          <View style={styles.metaAvatarPlaceholder}><Text style={styles.metaAvatarText}>{article.author[0]?.toUpperCase()}</Text></View>
        )}
        <View>
          <Text style={styles.metaAuthor}>@{article.author}</Text>
          <Text style={styles.metaDate}>{article.publishedAt?.slice(0, 10) ?? ''}</Text>
        </View>
      </View>

      {/* 히어로 이미지 */}
      {article.imageUrls[0] && (
        <Image source={{ uri: article.imageUrls[0] }} style={styles.coverImage} />
      )}

      {/* 본문 */}
      {article.content.split('\n').filter(Boolean).map((p, i) => (
        <Text key={i} style={styles.body}>{p}</Text>
      ))}

      {/* 추가 이미지 */}
      {article.imageUrls.slice(1).map((url, i) => (
        <Image key={i} source={{ uri: url }} style={styles.inlineImage} />
      ))}

      {/* 거래 정보 */}
      {article.item && (
        <View style={styles.tradeBox}>
          <View style={styles.tradePriceRow}>
            <Text style={styles.tradePrice}>{article.item.price.toLocaleString()}원</Text>
            {article.item.isSold && <View style={styles.soldBadge}><Text style={styles.soldBadgeText}>판매완료</Text></View>}
          </View>
          <View style={styles.tradeMetaRow}>
            <Text style={styles.tradeMetaLabel}>상태</Text>
            <Text style={styles.tradeMetaValue}>{article.item.condition}급</Text>
          </View>
          <View style={styles.tradeMetaRow}>
            <Text style={styles.tradeMetaLabel}>거래</Text>
            <Text style={styles.tradeMetaValue}>{article.item.tradeType}</Text>
          </View>

          {/* 인스타/카카오 연락 버튼 */}
          {!article.item.isSold && (article.authorInstagramId || article.authorKakaoUrl) && (
            <View style={styles.contactRow}>
              {article.authorInstagramId && (
                <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL(`https://instagram.com/${article.authorInstagramId}`)}>
                  <Text style={styles.contactBtnText}>📷 인스타 DM</Text>
                </TouchableOpacity>
              )}
              {article.authorKakaoUrl && (
                <TouchableOpacity style={[styles.contactBtn, styles.kakaoBtn]} onPress={() => Linking.openURL(article.authorKakaoUrl!)}>
                  <Text style={styles.kakaoBtnText}>💬 카카오 채팅</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* 판매완료 처리 (본인 글일 때는 추후 처리, 지금은 노출) */}
          {!article.item.isSold && (
            <TouchableOpacity style={styles.markSoldBtn} onPress={handleMarkSold}>
              <Text style={styles.markSoldBtnText}>판매완료 처리</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* 작성자 프로필 */}
      <TouchableOpacity style={styles.authorBox} onPress={() => navigation.navigate('UserProfile', { id: article.authorId })}>
        {article.authorAvatarUrl ? (
          <Image source={{ uri: article.authorAvatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{article.author[0]?.toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>@{article.author}</Text>
          {article.authorBio && <Text style={styles.authorBio} numberOfLines={1}>{article.authorBio}</Text>}
          <Text style={styles.authorMeta}>팔로워 {article.authorFollowers} · 글 {article.authorArticles}</Text>
        </View>
        <TouchableOpacity style={[styles.followBtn, isFollowing && styles.followingBtn]} onPress={toggleFollow}>
          <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
            {isFollowing ? '팔로잉' : '팔로우'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { padding: 20, paddingBottom: 48 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tag: { fontSize: 12, color: '#888', marginBottom: 8, fontWeight: '600', letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: '700', color: '#111', lineHeight: 32, marginBottom: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  metaAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eee' },
  metaAvatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#ddd', alignItems: 'center', justifyContent: 'center' },
  metaAvatarText: { fontSize: 14, fontWeight: '600' },
  metaAuthor: { fontSize: 14, fontWeight: '500', color: '#333' },
  metaDate: { fontSize: 12, color: '#bbb' },
  coverImage: { width: '100%', height: 240, borderRadius: 12, backgroundColor: '#f0f0f0', marginBottom: 20 },
  body: { fontSize: 18, color: '#222', lineHeight: 30, marginBottom: 12 },
  inlineImage: { width: '100%', height: 200, borderRadius: 8, backgroundColor: '#f0f0f0', marginBottom: 12 },
  tradeBox: { backgroundColor: '#f8f8f8', borderRadius: 16, padding: 20, marginBottom: 24, gap: 10 },
  tradePriceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tradePrice: { fontSize: 28, fontWeight: '700', color: '#111' },
  soldBadge: { backgroundColor: '#ddd', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  soldBadgeText: { fontSize: 12, color: '#666', fontWeight: '600' },
  tradeMetaRow: { flexDirection: 'row', gap: 16 },
  tradeMetaLabel: { fontSize: 13, color: '#aaa', width: 30 },
  tradeMetaValue: { fontSize: 13, color: '#444' },
  contactRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  contactBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#111', alignItems: 'center' },
  contactBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  kakaoBtn: { backgroundColor: '#ffe812' },
  kakaoBtnText: { color: '#000', fontSize: 14, fontWeight: '600' },
  markSoldBtn: { paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', marginTop: 4 },
  markSoldBtnText: { fontSize: 13, color: '#888' },
  authorBox: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#f9f9f9', borderRadius: 12, marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eee' },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ffe812', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700' },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '600', color: '#111' },
  authorBio: { fontSize: 12, color: '#888', marginTop: 2 },
  authorMeta: { fontSize: 11, color: '#bbb', marginTop: 2 },
  followBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#111' },
  followingBtn: { backgroundColor: '#111' },
  followBtnText: { fontSize: 13, fontWeight: '600', color: '#111' },
  followingBtnText: { color: '#fff' },
});
