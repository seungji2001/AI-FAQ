import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { Colors, FontSize, FontWeight } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArticleService } from '../core/services/ArticleService';
import { UserService } from '../core/services/UserService';
import { ArticleListItem } from '../types/article';
import { UserItem } from '../types/user';
import ArticleCard from '../components/ArticleCard';
import UserItemComponent from '../components/UserItem';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [arts, usrs] = await Promise.all([
      ArticleService.fetchAll().catch(() => []),
      UserService.fetchAll().catch(() => []),
    ]);
    setArticles(arts);
    setUsers(usrs);
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const featured = articles[0] ?? null;
  const rest = articles.slice(1);

  if (loading) return <View style={styles.center}><Text style={styles.sub}>불러오는 중...</Text></View>;

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.section}>
        {featured && (
          <ArticleCard featured article={featured} onPress={() => navigation.navigate('ArticleDetail', { id: featured.id })} />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 글</Text>
        {rest.length === 0 ? (
          <Text style={styles.sub}>아직 글이 없습니다.</Text>
        ) : (
          <View style={styles.grid}>
            {rest.map(article => (
              <View key={article.id} style={styles.gridItem}>
                <ArticleCard article={article} onPress={() => navigation.navigate('ArticleDetail', { id: article.id })} />
              </View>
            ))}
          </View>
        )}
      </View>

      {users.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘의 에디터</Text>
          {users.slice(0, 5).map(user => (
            <UserItemComponent key={user.id} user={user} onPress={() => navigation.navigate('UserProfile', { id: user.id })} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.ivory },
  section: { paddingHorizontal: 16, paddingVertical: 12 },
  sectionTitle: { fontSize: FontSize.xl2, fontWeight: FontWeight.semibold, marginBottom: 12, color: Colors.ink },
  sub: { fontSize: FontSize.md, color: Colors.textSecondary },
  grid: { gap: 12 },
  gridItem: { width: '100%' },
});
