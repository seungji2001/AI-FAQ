"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import PublishIcon from "@mui/icons-material/Publish";
import Link from "next/link";
import { tokenStorage, getUserFromToken } from "@/lib/auth/token";
import { fetchArticlesByUser, fetchMyDrafts, deleteArticle, publishDraft } from "@/lib/api/articles";
import { fetchMyProfile, updateMyProfile, updateMyAvatar } from "@/lib/api/users";
import { uploadImage } from "@/lib/api/upload";
import { fetchFollowing, fetchFollowers } from "@/lib/api/follow";
import { ApiError } from "@/lib/api/client";
import { ArticleListItem } from "@/lib/types/article";
import { UserItem, UserProfile, UserUpdateRequest } from "@/lib/types/user";
import ItemCard from "@/app/components/ItemCard";
import EditorItem from "@/app/components/EditorItem";
import InputRow from "@/app/components/ui/InputRow";
import { articleGrid, mainContent, panelBase } from "@/lib/styles/sx";
import { fs, fw, titleMd, textSecondary, labelBold } from "@/lib/styles/typography";
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
  const { locale } = useParams() as { locale: string };
  const [tab, setTab] = useState(0);
  const [published, setPublished] = useState<ArticleListItem[]>([]);
  const [drafts, setDrafts] = useState<ArticleListItem[]>([]);
  const [following, setFollowing] = useState<UserItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followers, setFollowers] = useState<UserItem[]>([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [followersLoaded, setFollowersLoaded] = useState(false);
  const [editForm, setEditForm] = useState<UserUpdateRequest>({});
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) { router.replace("/"); return; }
    const user = getUserFromToken(token);
    if (!user) { router.replace("/"); return; }

    Promise.all([
      fetchMyProfile().catch(() => null),
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

  const openFollowers = async () => {
    setFollowersOpen(true);
    if (followersLoaded) return;
    setFollowersLoading(true);
    try {
      const data = await fetchFollowers(profile!.id);
      setFollowers(data);
      setFollowersLoaded(true);
    } catch {
      toast.error(t.mypage.followersLoadFailed);
    } finally {
      setFollowersLoading(false);
    }
  };

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
      toast.success(t.mypage.saveSuccess);
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
      toast.success(t.mypage.deleteSuccess);
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
      toast.success(t.mypage.publishSuccess);
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.mypage.publishFailed} (${(e as ApiError).status})` : t.mypage.publishError);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const url = await uploadImage(file);
      await updateMyAvatar(url);
      setProfile((prev) => prev ? { ...prev, avatarUrl: url } : prev);
      toast.success(t.mypage.avatarSuccess);
    } catch {
      toast.error(t.mypage.avatarError);
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const displayName = profile?.displayName ?? profile?.username ?? "";
  const username = profile?.username ?? "";

  return (
    <Box sx={mainContent}>
      {/* 프로필 헤더 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            id="avatar-upload"
            onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
            <Avatar
              src={profile?.avatarUrl ?? undefined}
              sx={{ width: 56, height: 56, bgcolor: KAKAO_COLOR, color: KAKAO_TEXT_COLOR, fontSize: fs["2xl"], fontWeight: fw.bold, opacity: avatarUploading ? 0.5 : 1, transition: "opacity 0.2s" }}
            >
              {username[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.35)", borderRadius: "50%", opacity: 0, "&:hover": { opacity: 1 }, transition: "opacity 0.2s" }}>
              <Typography sx={{ fontSize: "10px", color: "white", fontWeight: fw.bold, textAlign: "center", lineHeight: 1.2 }}>
                {avatarUploading ? "..." : t.mypage.change}
              </Typography>
            </Box>
          </label>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: fs["2xl"], fontWeight: fw.bold }}>{displayName || `@${username}`}</Typography>
          <Typography sx={textSecondary}>
            @{username} · {t.mypage.publishedTab} {published.length} · {t.mypage.followingTab} {profile?.followingCount ?? following.length}
            {profile && (
              <>
                {" · "}
                <Box
                  component="span"
                  onClick={openFollowers}
                  sx={{ cursor: "pointer", "&:hover": { color: "text.primary" } }}
                >
                  {t.article.followers} {profile.followerCount}
                </Box>
              </>
            )}
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
                <Box sx={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 0.5 }}>
                  <Link href={`/${locale}/edit/${a.id}`}>
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
              <Box key={a.id} sx={{ position: "relative" }}>
                <ItemCard id={a.id} title={a.title} tag={a.tags[0] ?? ""} imageSrc={a.coverUrl ?? undefined} href={`/${locale}/edit/${a.id}`} />
                <Box sx={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: 0.5 }}>
                  <Link href={`/${locale}/edit/${a.id}`}>
                    <IconButton size="small" sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "8px", p: 0.5, "&:hover": { bgcolor: "grey.100" } }}>
                      <EditOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    </IconButton>
                  </Link>
                  <IconButton size="small"
                    onClick={() => handlePublishDraft(a.id)}
                    sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "8px", p: 0.5, "&:hover": { bgcolor: "primary.50", borderColor: "primary.200" } }}>
                    <PublishIcon sx={{ fontSize: 14, color: "primary.main" }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(a.id)} sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "8px", p: 0.5, "&:hover": { bgcolor: "error.50", borderColor: "error.200", color: "error.main" } }}>
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
                  followers={String(u.followerCount)}
                  articles={u.articleCount}
                  avatarSrc={u.avatarUrl ?? undefined}
                />
              </Box>
            ))}
          </Box>
        )
      )}

      {/* 팔로워 다이얼로그 */}
      <Dialog open={followersOpen} onClose={() => setFollowersOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={titleMd}>{t.article.followers}</DialogTitle>
        <DialogContent>
          {followersLoading ? (
            <Typography sx={textSecondary}>{t.mypage.loading}</Typography>
          ) : followers.length === 0 ? (
            <Typography sx={textSecondary}>{t.mypage.noFollowers}</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pt: 1 }}>
              {followers.map((u) => (
                <Box key={u.id} sx={{ ...panelBase, p: 1.5 }}>
                  <EditorItem
                    userId={u.id}
                    username={`@${u.username}`}
                    followers={String(u.followerCount)}
                    articles={u.articleCount}
                    avatarSrc={u.avatarUrl ?? undefined}
                  />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFollowersOpen(false)} sx={{ fontSize: fs.sm }}>{t.mypage.close}</Button>
        </DialogActions>
      </Dialog>

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
