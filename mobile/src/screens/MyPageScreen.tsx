import { Colors, FontSize, FontWeight, Radius } from '../styles/theme';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserService } from '../core/services/UserService';
import { ArticleService } from '../core/services/ArticleService';
import AuthService from '../core/services/AuthService';
import { UploadService } from '../core/services/UploadService';
import { UserProfile, UserItem } from '../types/user';
import { ArticleListItem } from '../types/article';
import ArticleCard from '../components/ArticleCard';
import UserItemComponent from '../components/UserItem';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Tab = 'published' | 'drafts' | 'following';

export default function MyPageScreen() {
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<Tab>('published');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [published, setPublished] = useState<ArticleListItem[]>([]);
  const [drafts, setDrafts] = useState<ArticleListItem[]>([]);
  const [following, setFollowing] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<{ displayName: string; bio: string; instagramId: string; kakaoUrl: string }>({ displayName: '', bio: '', instagramId: '', kakaoUrl: '' });
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const load = useCallback(async () => {
    const [prof, pub, drf, fol] = await Promise.all([
      UserService.fetchMe().catch(() => null),
      ArticleService.fetchAll().catch(() => []),
      ArticleService.fetchMyDrafts().catch(() => []),
      UserService.fetchFollowing().catch(() => []),
    ]);
    setProfile(prof);
    setPublished(pub);
    setDrafts(drf);
    setFollowing(fol as UserItem[]);
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await UserService.updateMe(editForm);
      setProfile(prev => prev ? { ...prev, ...editForm } : prev);
      setEditOpen(false);
    } catch { Alert.alert('오류', '저장에 실패했습니다.'); }
    finally { setSaving(false); }
  };

  const handleAvatarChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.85 });
    if (result.canceled) return;
    const asset = result.assets[0];
    setAvatarUploading(true);
    try {
      const ext = asset.uri.split('.').pop() ?? 'jpg';
      const url = await UploadService.uploadImage(asset.uri, `avatar_${Date.now()}.${ext}`, `image/${ext === 'jpg' ? 'jpeg' : ext}`);
      await UserService.updateAvatar(url);
      setProfile(prev => prev ? { ...prev, avatarUrl: url } : prev);
    } catch { Alert.alert('오류', '이미지 업로드에 실패했습니다.'); }
    finally { setAvatarUploading(false); }
  };

  const handleDelete = (id: string) => {
    Alert.alert('삭제', '글을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: async () => {
        await ArticleService.delete(id).catch(() => {});
        setPublished(prev => prev.filter(a => a.id !== id));
        setDrafts(prev => prev.filter(a => a.id !== id));
      }},
    ]);
  };

  const handlePublish = async (id: string) => {
    await ArticleService.publish(id).catch(() => {});
    const article = drafts.find(a => a.id === id);
    if (article) {
      setDrafts(prev => prev.filter(a => a.id !== id));
      setPublished(prev => [{ ...article, isPublished: true }, ...prev]);
    }
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: async () => {
        await AuthService.logout().catch(() => {});
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }},
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator /></View>;

  const tabData = tab === 'published' ? published : tab === 'drafts' ? drafts : [];

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAvatarChange} disabled={avatarUploading}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={[styles.avatar, avatarUploading && { opacity: 0.5 }]} />
          ) : (
            <View style={[styles.avatarPlaceholder, avatarUploading && { opacity: 0.5 }]}>
              <Text style={styles.avatarText}>{(profile?.displayName || profile?.username || '?')[0]?.toUpperCase()}</Text>
            </View>
          )}
          {avatarUploading && <ActivityIndicator style={StyleSheet.absoluteFillObject} />}
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{profile?.displayName || `@${profile?.username}`}</Text>
          <Text style={styles.username}>@{profile?.username}</Text>
          <Text style={styles.stats}>글 {published.length} · 팔로잉 {following.length}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => {
            setEditForm({ displayName: profile?.displayName ?? '', bio: profile?.bio ?? '', instagramId: profile?.instagramId ?? '', kakaoUrl: profile?.kakaoUrl ?? '' });
            setEditOpen(true);
          }}>
            <Text style={styles.editBtnText}>편집</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 탭 */}
      <View style={styles.tabs}>
        {(['published', 'drafts', 'following'] as Tab[]).map(t => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'published' ? `발행 (${published.length})` : t === 'drafts' ? `임시저장 (${drafts.length})` : `팔로잉 (${following.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 탭 콘텐츠 */}
      <View style={styles.tabContent}>
        {tab === 'following' ? (
          following.length === 0 ? <Text style={styles.empty}>팔로잉이 없습니다.</Text> :
          following.map(u => <UserItemComponent key={u.id} user={u} onPress={() => navigation.navigate('UserProfile', { id: u.id })} />)
        ) : tabData.length === 0 ? (
          <Text style={styles.empty}>{tab === 'drafts' ? '임시저장된 글이 없습니다.' : '발행된 글이 없습니다.'}</Text>
        ) : tabData.map(article => (
          <View key={article.id} style={styles.articleWrap}>
            <ArticleCard article={article} onPress={() => navigation.navigate('ArticleDetail', { id: article.id })} />
            <View style={styles.articleActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Write', { id: article.id })}>
                <Text style={styles.actionBtnText}>✏️ 수정</Text>
              </TouchableOpacity>
              {tab === 'drafts' && (
                <TouchableOpacity style={styles.actionBtn} onPress={() => handlePublish(article.id)}>
                  <Text style={styles.actionBtnText}>📤 발행</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => handleDelete(article.id)}>
                <Text style={styles.deleteBtnText}>🗑 삭제</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* 프로필 수정 모달 */}
      <Modal visible={editOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>프로필 수정</Text>
            <Text style={styles.label}>이름</Text>
            <TextInput style={styles.input} value={editForm.displayName} onChangeText={v => setEditForm(f => ({ ...f, displayName: v }))} placeholder="표시 이름" />
            <Text style={styles.label}>소개</Text>
            <TextInput style={[styles.input, styles.textArea]} value={editForm.bio} onChangeText={v => setEditForm(f => ({ ...f, bio: v }))} placeholder="자기소개" multiline numberOfLines={3} />
            <Text style={styles.label}>인스타그램 아이디</Text>
            <TextInput style={styles.input} value={editForm.instagramId} onChangeText={v => setEditForm(f => ({ ...f, instagramId: v }))} placeholder="@없이 입력" />
            <Text style={styles.label}>카카오 오픈채팅 URL</Text>
            <TextInput style={styles.input} value={editForm.kakaoUrl} onChangeText={v => setEditForm(f => ({ ...f, kakaoUrl: v }))} placeholder="https://open.kakao.com/..." />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditOpen(false)}>
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={saving}>
                <Text style={styles.saveBtnText}>{saving ? '저장 중...' : '저장'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  avatar: { width: 56, height: 56, borderRadius: 28, flexShrink: 0 },
  avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#ffe812', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: 22, fontWeight: '700' },
  headerInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#111' },
  username: { fontSize: 13, color: '#999' },
  stats: { fontSize: 12, color: '#aaa', marginTop: 2 },
  headerActions: { gap: 6 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  editBtnText: { fontSize: 13 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ffcccc' },
  logoutBtnText: { fontSize: 13, color: '#e44' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#f0f0f0' },
  tabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderColor: '#111' },
  tabText: { fontSize: 13, color: '#aaa' },
  tabTextActive: { color: '#111', fontWeight: '600' },
  tabContent: { padding: 16, gap: 12 },
  articleWrap: { gap: 8 },
  articleActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  actionBtnText: { fontSize: 12 },
  deleteBtn: { borderColor: '#ffcccc' },
  deleteBtnText: { fontSize: 12, color: '#e44' },
  empty: { textAlign: 'center', color: '#aaa', paddingVertical: 32 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.ivory, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 13, color: '#666', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  saveBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10, backgroundColor: '#111' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
});
