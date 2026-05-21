import { Colors, FontSize, FontWeight, Radius } from '../styles/theme';
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet,
  Switch, Alert, ActivityIndicator, Image, FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArticleService } from '../core/services/ArticleService';
import { UploadService } from '../core/services/UploadService';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Route = RouteProp<RootStackParamList, 'Write'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

type Condition = 'S' | 'A' | 'B' | 'C';
type Delivery = '택배' | '직거래' | '협의';

interface UploadingFile { id: string; progress: number }

export default function WriteScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const editId = route.params?.id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  // 판매 설정
  const [isSale, setIsSale] = useState(false);
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Condition>('A');
  const [delivery, setDelivery] = useState<Delivery>('택배');
  const [instagramId, setInstagramId] = useState('');
  const [kakaoUrl, setKakaoUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(!editId);

  useEffect(() => {
    if (!editId) return;
    ArticleService.fetchForEdit(editId)
      .then(a => {
        setTitle(a.title);
        setContent(a.content ?? '');
        setTags(a.tags ?? []);
        setImageUrls(a.imageUrls ?? []);
        if (a.item) {
          setIsSale(true);
          setPrice(String(a.item.price));
          setCondition((a.item.condition as Condition) ?? 'A');
          setDelivery((a.item.tradeType as Delivery) ?? '택배');
        }
        setReady(true);
      })
      .catch(() => { Alert.alert('오류', '글을 불러올 수 없습니다.'); navigation.goBack(); });
  }, [editId]);

  const handlePickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (result.canceled || imageUrls.length >= 10) return;

    const toUpload = result.assets.slice(0, 10 - imageUrls.length);
    for (const asset of toUpload) {
      const id = Date.now().toString();
      setUploadingFiles(prev => [...prev, { id, progress: 0 }]);
      try {
        const ext = asset.uri.split('.').pop() ?? 'jpg';
        const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        const url = await UploadService.uploadImage(
          asset.uri,
          `${id}.${ext}`,
          contentType,
          (pct) => setUploadingFiles(prev => prev.map(f => f.id === id ? { ...f, progress: pct } : f))
        );
        setImageUrls(prev => [...prev, url]);
      } catch {
        Alert.alert('오류', '이미지 업로드에 실패했습니다.');
      } finally {
        setUploadingFiles(prev => prev.filter(f => f.id !== id));
      }
    }
  };

  const handleTagAdd = () => {
    const t = tagInput.trim().replace(/^#/, '');
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const buildItemPayload = () => ({
    forSale: isSale,
    price: isSale ? Number(price) : undefined,
    condition: isSale ? condition : undefined,
    tradeType: isSale ? delivery : undefined,
  });

  const validate = (isPublish: boolean) => {
    if (!title.trim()) { Alert.alert('알림', '제목을 입력해주세요.'); return false; }
    if (isPublish && !content.trim()) { Alert.alert('알림', '내용을 입력해주세요.'); return false; }
    if (isSale && !price) { Alert.alert('알림', '가격을 입력해주세요.'); return false; }
    return true;
  };

  const handleSave = async (isPublished: boolean) => {
    if (!validate(isPublished)) return;
    setLoading(true);
    try {
      const body = { title, content, tags, imageUrls, isPublished, item: buildItemPayload() };
      if (editId) {
        await ArticleService.update(editId, body);
      } else {
        const { id } = await ArticleService.create(body);
        if (isPublished) { navigation.replace('ArticleDetail', { id }); return; }
      }
      navigation.goBack();
    } catch { Alert.alert('오류', '저장에 실패했습니다.'); }
    finally { setLoading(false); }
  };

  if (!ready) return <View style={styles.center}><ActivityIndicator /></View>;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* 이미지 영역 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll} contentContainerStyle={styles.imageRow}>
          {imageUrls.length === 0 && uploadingFiles.length === 0 ? (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={handlePickImages}>
              <Text style={styles.imagePlaceholderIcon}>+</Text>
              <Text style={styles.imagePlaceholderText}>이미지 추가</Text>
            </TouchableOpacity>
          ) : (
            <>
              {imageUrls.map((url, i) => (
                <View key={url} style={styles.imageThumb}>
                  <Image source={{ uri: url }} style={styles.imageThumbImg} />
                  {i === 0 && <View style={styles.coverBadge}><Text style={styles.coverBadgeText}>표지</Text></View>}
                  <TouchableOpacity style={styles.imageRemove} onPress={() => setImageUrls(prev => prev.filter((_, j) => j !== i))}>
                    <Text style={styles.imageRemoveText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {uploadingFiles.map(f => (
                <View key={f.id} style={[styles.imageThumb, styles.imageUploading]}>
                  <Text style={styles.uploadPct}>{f.progress}%</Text>
                </View>
              ))}
              {imageUrls.length < 10 && (
                <TouchableOpacity style={styles.imageAddMore} onPress={handlePickImages}>
                  <Text style={styles.imagePlaceholderIcon}>+</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>

        {/* 제목 */}
        <TextInput style={styles.titleInput} placeholder="제목" value={title} onChangeText={setTitle} placeholderTextColor="#bbb" />

        {/* 본문 */}
        <TextInput style={styles.contentInput} placeholder="내용을 작성해주세요..." value={content} onChangeText={setContent} multiline placeholderTextColor="#bbb" />

        {/* 태그 */}
        <View style={styles.tagSection}>
          <Text style={styles.label}>태그</Text>
          <View style={styles.tagRow}>
            {tags.map(t => (
              <TouchableOpacity key={t} style={styles.tagChip} onPress={() => setTags(prev => prev.filter(x => x !== t))}>
                <Text style={styles.tagChipText}>#{t} ✕</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.tagInput}
              placeholder="태그 입력 후 Enter"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleTagAdd}
              blurOnSubmit={false}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* 판매 설정 */}
        <View style={styles.saleSection}>
          <View style={styles.saleHeader}>
            <Text style={styles.saleSectionTitle}>판매 설정</Text>
            <Switch value={isSale} onValueChange={setIsSale} trackColor={{ true: '#111' }} />
          </View>

          {isSale && (
            <>
              <Text style={styles.label}>가격</Text>
              <View style={styles.priceRow}>
                <TextInput style={[styles.input, { flex: 1 }]} placeholder="가격" value={price} onChangeText={setPrice} keyboardType="numeric" />
                <Text style={styles.priceUnit}>원</Text>
              </View>

              <Text style={styles.label}>상태</Text>
              <View style={styles.chipRow}>
                {(['S', 'A', 'B', 'C'] as Condition[]).map(c => (
                  <TouchableOpacity key={c} style={[styles.selectChip, condition === c && styles.selectChipActive]} onPress={() => setCondition(c)}>
                    <Text style={[styles.selectChipText, condition === c && styles.selectChipTextActive]}>{c}급</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>거래 방법</Text>
              <View style={styles.chipRow}>
                {(['택배', '직거래', '협의'] as Delivery[]).map(d => (
                  <TouchableOpacity key={d} style={[styles.selectChip, delivery === d && styles.selectChipActive]} onPress={() => setDelivery(d)}>
                    <Text style={[styles.selectChipText, delivery === d && styles.selectChipTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>연락처</Text>
              <TextInput style={styles.input} placeholder="인스타그램 아이디" value={instagramId} onChangeText={setInstagramId} />
              <TextInput style={styles.input} placeholder="카카오 오픈채팅 URL" value={kakaoUrl} onChangeText={setKakaoUrl} />
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.draftBtn} onPress={() => handleSave(false)} disabled={loading}>
          <Text style={styles.draftBtnText}>임시저장</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishBtn} onPress={() => handleSave(true)} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishBtnText}>발행하기</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 8 },
  imageScroll: { maxHeight: 130 },
  imageRow: { padding: 12, gap: 8, alignItems: 'center' },
  imagePlaceholder: { width: 100, height: 100, backgroundColor: '#f0f0f0', borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 4 },
  imagePlaceholderIcon: { fontSize: 28, color: '#bbb' },
  imagePlaceholderText: { fontSize: 11, color: '#bbb' },
  imageThumb: { width: 100, height: 100, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  imageThumbImg: { width: '100%', height: '100%' },
  coverBadge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  coverBadgeText: { color: '#fff', fontSize: 10 },
  imageRemove: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  imageRemoveText: { color: '#fff', fontSize: 10 },
  imageUploading: { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  uploadPct: { fontSize: 13, color: '#888' },
  imageAddMore: { width: 100, height: 100, borderRadius: 10, borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  titleInput: { fontSize: 22, fontWeight: '700', color: '#111', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  contentInput: { fontSize: 16, color: '#333', lineHeight: 26, minHeight: 180, paddingHorizontal: 16, paddingVertical: 12, textAlignVertical: 'top', borderBottomWidth: 1, borderColor: '#f0f0f0' },
  tagSection: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  label: { fontSize: 13, color: '#666', marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  tagChip: { backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  tagChipText: { fontSize: 13, color: '#555' },
  tagInput: { fontSize: 14, minWidth: 80, paddingVertical: 4 },
  saleSection: { padding: 16 },
  saleHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  saleSectionTitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  priceUnit: { fontSize: 15, color: '#555' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, marginBottom: 12 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  selectChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
  selectChipActive: { backgroundColor: '#111', borderColor: '#111' },
  selectChipText: { fontSize: 14, color: '#555' },
  selectChipTextActive: { color: '#fff' },
  footer: { flexDirection: 'row', padding: 16, gap: 12, borderTopWidth: 1, borderColor: '#f0f0f0' },
  draftBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  draftBtnText: { fontSize: 15, color: '#555' },
  publishBtn: { flex: 2, paddingVertical: 14, borderRadius: 12, backgroundColor: '#111', alignItems: 'center' },
  publishBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
