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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Link from "next/link";
import { tokenStorage, getUserFromToken } from "@/lib/auth/token";
import { fetchArticlesByUser, fetchMyDrafts, deleteArticle, publishDraft } from "@/lib/api/articles";
import { fetchUser, updateMyProfile } from "@/lib/api/users";
import { ApiError } from "@/lib/api/client";
import { ArticleListItem } from "@/lib/types/article";
import { UserProfile, UserUpdateRequest } from "@/lib/types/user";
import ItemCard from "@/app/components/ItemCard";
import InputRow from "@/app/components/ui/InputRow";
import { articleGrid, mainContent, panelBase } from "@/lib/styles/sx";
import { fs, fw, titleMd, textSecondary, labelBold } from "@/lib/styles/typography";
import { BRAND_COLOR, BRAND_COLOR_HOVER, KAKAO_COLOR, KAKAO_TEXT_COLOR } from "@/lib/constants/theme";
import { useT } from "@/lib/i18n/context";

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
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [published, setPublished] = useState<ArticleListItem[]>([]);
  const [drafts, setDrafts] = useState<ArticleListItem[]>([]);
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
    ]).then(([prof, pub, drf]) => {
      setProfile(prof);
      setPublished(pub);
      setDrafts(drf);
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
    } catch (e) {
      alert(e instanceof ApiError ? `${t.mypage.saveFailed} (${(e as ApiError).status})` : t.mypage.saveError);
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
    } catch (e) {
      alert(e instanceof ApiError ? `${t.mypage.deleteFailed} (${(e as ApiError).status})` : t.mypage.deleteError);
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
    } catch (e) {
      alert(e instanceof ApiError ? `${t.mypage.publishFailed} (${(e as ApiError).status})` : t.mypage.publishError);
    }
  };

  const displayName = profile?.displayName ?? profile?.username ?? "";
  const username = profile?.username ?? "";

  return (
    <Box sx={mainContent}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Avatar src={profile?.avatarUrl ?? undefined} sx={{ width: 56, height: 56, bgcolor: KAKAO_COLOR, color: KAKAO_TEXT_COLOR, fontSize: fs["2xl"], fontWeight: fw.bold }}>
          {username[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: fs["2xl"], fontWeight: fw.bold }}>{displayName || `@${username}`}</Typography>
          <Typography sx={textSecondary}>@{username} · {t.mypage.publishedTab} {published.length} · {t.mypage.draftsTab} {drafts.length}</Typography>
          {profile?.bio && <Typography sx={{ fontSize: fs.sm, mt: 0.5 }}>{profile.bio}</Typography>}
        </Box>
        <Button size="small" variant="outlined" onClick={openEdit} sx={{ fontSize: fs.sm, borderRadius: 2, flexShrink: 0 }}>
          {t.mypage.editProfile}
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label={`${t.mypage.publishedTab} (${published.length})`} sx={{ fontSize: fs.md }} />
        <Tab label={`${t.mypage.draftsTab} (${drafts.length})`} sx={{ fontSize: fs.md }} />
      </Tabs>

      {loading ? (
        <Typography sx={textSecondary}>{t.mypage.loading}</Typography>
      ) : tab === 0 ? (
        published.length === 0 ? (
          <Typography sx={textSecondary}>{t.mypage.noPublished}</Typography>
        ) : (
          <Box sx={articleGrid}>
            {published.map((a) => (
              <Box key={a.id}>
                <ItemCard id={a.id} title={a.title} tag={a.tags[0] ?? ""} imageSrc={a.coverUrl ?? undefined} />
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Link href={`/edit/${a.id}`} style={{ flex: 1 }}>
                    <Button fullWidth size="small" variant="outlined" sx={{ fontSize: fs.sm, borderRadius: 2 }}>{t.mypage.edit}</Button>
                  </Link>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(a.id)} sx={{ flex: 1, fontSize: fs.sm, borderRadius: 2 }}>{t.mypage.delete}</Button>
                </Box>
              </Box>
            ))}
          </Box>
        )
      ) : (
        drafts.length === 0 ? (
          <Typography sx={textSecondary}>{t.mypage.noDrafts}</Typography>
        ) : (
          <Box sx={articleGrid}>
            {drafts.map((a) => (
              <Box key={a.id}>
                <Box sx={{ ...panelBase, p: 2, mb: 1 }}>
                  <Typography sx={{ fontSize: fs.md, fontWeight: fw.bold, mb: 0.5 }} noWrap>{a.title}</Typography>
                  <Typography sx={textSecondary}>{a.tags.join(" ")}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Link href={`/edit/${a.id}`} style={{ flex: 1 }}>
                    <Button fullWidth size="small" variant="outlined" sx={{ fontSize: fs.sm, borderRadius: 2 }}>{t.mypage.edit}</Button>
                  </Link>
                  <Button size="small" variant="contained" onClick={() => handlePublishDraft(a.id)} sx={{ flex: 1, fontSize: fs.sm, borderRadius: 2, bgcolor: BRAND_COLOR, "&:hover": { bgcolor: BRAND_COLOR_HOVER } }}>{t.mypage.publishBtn}</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(a.id)} sx={{ flex: 1, fontSize: fs.sm, borderRadius: 2 }}>{t.mypage.delete}</Button>
                </Box>
              </Box>
            ))}
          </Box>
        )
      )}

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
          <Button variant="contained" disabled={saving} onClick={handleSaveProfile} sx={{ fontSize: fs.sm, bgcolor: BRAND_COLOR, "&:hover": { bgcolor: BRAND_COLOR_HOVER } }}>
            {saving ? t.mypage.saving : t.mypage.save}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
