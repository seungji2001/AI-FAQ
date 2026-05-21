import { Colors, FontSize, FontWeight, Radius } from '../styles/theme';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserService } from '../core/services/UserService';
import { ArticleService } from '../core/services/ArticleService';
import { UserProfile } from '../types/user';
import { ArticleListItem } from '../types/article';
import ArticleCard from '../components/ArticleCard';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'UserProfile'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function UserProfileScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { id } = route.params;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      UserService.fetchOne(id),
      ArticleService.fetchByUser(id).catch(() => []),
      UserService.checkFollowing(id).catch(() => ({ following: false })),
    ]).then(([prof, arts, followRes]) => {
      setProfile(prof);
      setArticles(arts);
      setIsFollowing(followRes.following);
    }).finally(() => setLoading(false));
  }, [id]);

  const toggleFollow = async () => {
    try {
      if (isFollowing) { await UserService.unfollow(id); setIsFollowing(false); }
      else { await UserService.follow(id); setIsFollowing(true); }
    } catch {}
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;
  if (!profile) return <View style={styles.center}><Text>사용자를 찾을 수 없습니다.</Text></View>;

  return (
    <FlatList
      style={styles.container}
      data={articles}
      keyExtractor={a => a.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <View style={styles.header}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{(profile.displayName || profile.username)[0]?.toUpperCase()}</Text>
            </View>
          )}
          <Text style={styles.name}>{profile.displayName || `@${profile.username}`}</Text>
          <Text style={styles.username}>@{profile.username}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}
          <View style={styles.stats}>
            <Text style={styles.stat}>팔로워 {profile.followerCount}</Text>
            <Text style={styles.statDot}>·</Text>
            <Text style={styles.stat}>글 {profile.articleCount}</Text>
          </View>
          <TouchableOpacity style={[styles.followBtn, isFollowing && styles.followingBtn]} onPress={toggleFollow}>
            <Text style={[styles.followText, isFollowing && styles.followingText]}>
              {isFollowing ? '팔로잉' : '팔로우'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>작성한 글</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.cardWrap}>
          <ArticleCard article={item} onPress={() => navigation.navigate('ArticleDetail', { id: item.id })} />
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>아직 글이 없습니다.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { paddingBottom: 32 },
  header: { alignItems: 'center', padding: 24, borderBottomWidth: 1, borderColor: '#f0f0f0', marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#f0f0f0', marginBottom: 12 },
  avatarPlaceholder: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#ffe812', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: '#111' },
  username: { fontSize: 14, color: '#999', marginTop: 2 },
  bio: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 8, paddingHorizontal: 24 },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  stat: { fontSize: 14, color: '#555' },
  statDot: { color: '#ccc' },
  followBtn: { marginTop: 16, paddingHorizontal: 32, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#111' },
  followingBtn: { backgroundColor: '#111' },
  followText: { fontSize: 15, fontWeight: '600', color: '#111' },
  followingText: { color: '#fff' },
  sectionTitle: { alignSelf: 'flex-start', fontSize: 16, fontWeight: '700', marginTop: 24, color: '#111' },
  cardWrap: { paddingHorizontal: 16, marginBottom: 12 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 24, paddingHorizontal: 16 },
});
