"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { tokenStorage, getUserFromToken } from "@/lib/auth/token";
import { fetchArticlesByUser, fetchMyDrafts, deleteArticle, publishDraft } from "@/lib/api/articles";
import { fetchUser, updateMyProfile } from "@/lib/api/users";
import { fetchFollowing } from "@/lib/api/follow";
import { ApiError } from "@/lib/api/client";
import { ArticleListItem } from "@/lib/types/article";
import { UserItem, UserProfile, UserUpdateRequest } from "@/lib/types/user";
import ItemCard from "@/app/components/ItemCard";
import EditorItem from "@/app/components/EditorItem";
import InputRow from "@/app/components/ui/InputRow";
import { articleGrid, mainContent, panelBase } from "@/lib/styles/sx";
import { fs, fw, titleMd, textSecondary, labelBold, captionText } from "@/lib/styles/typography";
import { KAKAO_COLOR, KAKAO_TEXT_COLOR } from "@/lib/constants/theme";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";

function ProfileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ ...labelBold, mb: 0.5 }}>{label}</Typography>
      {children}
    </Box>
  );
}

export default function MyPage() {
  const t = useT();
  const toast = useToast();
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [published, setPublished] = useState<ArticleListItem[]>([]);
  const [drafts, setDrafts] = useState<ArticleListItem[]>([]);
  const [following, setFollowing] = useState<UserItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserUpdateRequest>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) { router.replace("/"); return; }
    const user = getUserFromToken(token);
    if (!user) { router.replace("/"); return; }

    Promise.all([
      fetchUser(user.userId).catch(() => null),
      fetchArticlesByUser(user.userId).catch(() => []),
      fetchMyDrafts().catch(() => []),
      fetchFollowing().catch(() => []),
    ]).then(([prof, pub, drf, fol]) => {
      setProfile(prof);
      setPublished(pub);
      setDrafts(drf);
      setFollowing(fol);
    }).finally(() => setLoading(false));
  }, [router]);

  const openEdit = () => {
    setEditForm({ displayName: profile?.displayName ?? "", bio: profile?.bio ?? "", instagramId: profile?.instagramId ?? "", kakaoUrl: profile?.kakaoUrl ?? "" });
    setEditOpen(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateMyProfile(editForm);
      setProfile((prev) => prev ? { ...prev, ...editForm } : prev);
      setEditOpen(false);
      toast.success(t.mypage.save + " 완료");
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.mypage.saveFailed} (${(e as ApiError).status})` : t.mypage.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.mypage.deleteConfirm)) return;
    try {
      await deleteArticle(id);
      setPublished((prev) => prev.filter((a) => a.id !== id));
      setDrafts((prev) => prev.filter((a) => a.id !== id));
      toast.success("삭제되었습니다.");
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.mypage.deleteFailed} (${(e as ApiError).status})` : t.mypage.deleteError);
    }
  };

  const handlePublishDraft = async (id: string) => {
    try {
      await publishDraft(id);
      const article = drafts.find((a) => a.id === id);
      if (article) {
        setDrafts((prev) => prev.filter((a) => a.id !== id));
        setPublished((prev) => [article, ...prev]);
      }
      toast.success("발행되었습니다.");
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.mypage.publishFailed} (${(e as ApiError).status})` : t.mypage.publishError);
    }
  };

  const displayName = profile?.displayName ?? profile?.username ?? "";
  const username = profile?.username ?? "";

  return (
    <Box sx={mainContent}>
      {/* 프로필 헤더 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar src={profile?.avatarUrl ?? undefined} sx={{ width: 56, height: 56, bgcolor: KAKAO_COLOR, color: KAKAO_TEXT_COLOR, fontSize: fs["2xl"], fontWeight: fw.bold }}>
          {username[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: fs["2xl"], fontWeight: fw.bold }}>{displayName || `@${username}`}</Typography>
          <Typography sx={textSecondary}>
            @{username} · {t.mypage.publishedTab} {published.length} · {t.mypage.followingTab} {following.length}
          </Typography>
          {profile?.bio && <Typography sx={{ fontSize: fs.sm, mt: 0.5 }}>{profile.bio}</Typography>}
        </Box>
        <Button size="small" variant="outlined" onClick={openEdit} sx={{ fontSize: fs.sm, flexShrink: 0 }}>
          {t.mypage.editProfile}
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* 탭 */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`${t.mypage.publishedTab} (${published.length})`} sx={{ fontSize: fs.md }} />
        <Tab label={`${t.mypage.draftsTab} (${drafts.length})`} sx={{ fontSize: fs.md }} />
        <Tab label={`${t.mypage.followingTab} (${following.length})`} sx={{ fontSize: fs.md }} />
      </Tabs>

      {loading ? (
        <Typography sx={textSecondary}>{t.mypage.loading}</Typography>
      ) : tab === 0 ? (
        /* ── 발행된 글 ── */
        published.length === 0 ? (
          <Typography sx={textSecondary}>{t.mypage.noPublished}</Typography>
        ) : (
          <Box sx={articleGrid}>
            {published.map((a) => (
              <Box key={a.id} sx={{ position: "relative" }}>
                <ItemCard id={a.id} title={a.title} tag={a.tags[0] ?? ""} imageSrc={a.coverUrl ?? undefined} />
                {/* 카드 내부 우상단 액션 버튼 */}
                <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.5 }}>
                  <Link href={`/edit/${a.id}`}>
                    <IconButton size="small" sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "8px", p: 0.5, "&:hover": { bgcolor: "grey.100" } }}>
                      <EditOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    </IconButton>
                  </Link>
                  <IconButton size="small" onClick={() => handleDelete(a.id)} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "8px", p: 0.5, "&:hover": { bgcolor: "error.50", borderColor: "error.200", color: "error.main" } }}>
                    <DeleteIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )
      ) : tab === 1 ? (
        /* ── 임시저장 ── */
        drafts.length === 0 ? (
          <Typography sx={textSecondary}>{t.mypage.noDrafts}</Typography>
        ) : (
          <Box sx={articleGrid}>
            {drafts.map((a) => (
              <Box key={a.id} sx={{ ...panelBase, p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: fs.md, fontWeight: fw.bold, mb: 0.25 }} noWrap>{a.title}</Typography>
                  <Typography sx={captionText}>{a.tags.join("  ")}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  <Link href={`/edit/${a.id}`}>
                    <IconButton size="small" sx={{ bgcolor: "grey.100", borderRadius: "8px", p: 0.5, "&:hover": { bgcolor: "grey.200" } }}>
                      <EditOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    </IconButton>
                  </Link>
                  <Button size="small" variant="contained" color="primary" disableElevation onClick={() => handlePublishDraft(a.id)}
                    sx={{ fontSize: fs.xs, px: 1.5, py: 0.5, minWidth: 0 }}>
                    {t.mypage.publishBtn}
                  </Button>
                  <IconButton size="small" onClick={() => handleDelete(a.id)} sx={{ bgcolor: "grey.100", borderRadius: "8px", p: 0.5, "&:hover": { bgcolor: "error.50", color: "error.main" } }}>
                    <DeleteIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )
      ) : (
        /* ── 팔로잉 ── */
        following.length === 0 ? (
          <Typography sx={textSecondary}>{t.mypage.noFollowing}</Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {following.map((u) => (
              <Box key={u.id} sx={{ ...panelBase, p: 2 }}>
                <EditorItem
                  userId={u.id}
                  username={`@${u.username}`}
                  followers={String(u.articleCount)}
                  articles={u.articleCount}
                  avatarSrc={u.avatarUrl ?? undefined}
                />
              </Box>
            ))}
          </Box>
        )
      )}

      {/* 프로필 수정 다이얼로그 */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={titleMd}>{t.mypage.editProfile}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ProfileField label={t.mypage.displayName}>
              <InputRow value={editForm.displayName ?? ""} onChange={(v) => setEditForm((f) => ({ ...f, displayName: v }))} />
            </ProfileField>
            <ProfileField label={t.mypage.bio}>
              <InputRow value={editForm.bio ?? ""} onChange={(v) => setEditForm((f) => ({ ...f, bio: v }))} multiline rows={3} />
            </ProfileField>
            <ProfileField label={t.mypage.instagramId}>
              <InputRow value={editForm.instagramId ?? ""} onChange={(v) => setEditForm((f) => ({ ...f, instagramId: v }))} />
            </ProfileField>
            <ProfileField label={t.mypage.kakaoUrl}>
              <InputRow value={editForm.kakaoUrl ?? ""} onChange={(v) => setEditForm((f) => ({ ...f, kakaoUrl: v }))} />
            </ProfileField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ fontSize: fs.sm }}>{t.mypage.cancel}</Button>
          <Button variant="contained" disabled={saving} onClick={handleSaveProfile} color="primary" sx={{ fontSize: fs.sm }}>
            {saving ? t.mypage.saving : t.mypage.save}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
