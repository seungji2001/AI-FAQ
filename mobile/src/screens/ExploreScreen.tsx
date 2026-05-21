import { Colors, FontSize, FontWeight, Radius } from '../styles/theme';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArticleService } from '../core/services/ArticleService';
import { ArticleListItem } from '../types/article';
import ArticleCard from '../components/ArticleCard';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ExploreScreen() {
  const navigation = useNavigation<Nav>();
  const [input, setInput] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ArticleService.fetchPopularTags().then(setPopularTags).catch(() => {});
  }, []);

  const search = useCallback((tag: string) => {
    const t = tag.trim().replace(/^#/, '');
    setActiveTag(t);
    setInput(t);
    setLoading(true);
    const fetcher = t ? ArticleService.fetchByTag(t) : ArticleService.fetchAll();
    fetcher.then(setArticles).catch(() => setArticles([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { search(''); }, []);

  return (
    <View style={styles.container}>
      {/* 검색창 */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="태그로 검색"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => search(input)}
          returnKeyType="search"
        />
      </View>

      {/* 인기 태그 */}
      {popularTags.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll} contentContainerStyle={styles.tagRow}>
          {popularTags.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, activeTag === tag && styles.tagActive]}
              onPress={() => search(tag)}
            >
              <Text style={[styles.tagText, activeTag === tag && styles.tagTextActive]}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {activeTag ? (
        <Text style={styles.resultInfo}>#{activeTag} 검색 결과 {articles.length}개</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={a => a.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ArticleCard article={item} onPress={() => navigation.navigate('ArticleDetail', { id: item.id })} />
          )}
          ListEmptyComponent={<Text style={styles.empty}>글이 없습니다.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  searchBox: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 12, height: 44 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15 },
  tagScroll: { maxHeight: 44 },
  tagRow: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f0f0f0' },
  tagActive: { backgroundColor: '#111' },
  tagText: { fontSize: 13, color: '#555' },
  tagTextActive: { color: '#fff' },
  resultInfo: { fontSize: 13, color: '#888', paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  list: { padding: 16, gap: 12 },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
});
