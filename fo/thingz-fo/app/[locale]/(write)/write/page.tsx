"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import WriteHeader from "@/app/components/write/WriteHeader";
import WriteEditor from "@/app/components/write/WriteEditor";
import WriteSaleSettings from "@/app/components/write/WriteSaleSettings";
import { createArticle } from "@/lib/api/articles";
import { ApiError } from "@/lib/api/client";
import { pageWithSidebar, sidebarWidth, mobileSidebar, mainContent, panelBase } from "@/lib/styles/sx";
import { tokenStorage } from "@/lib/auth/token";
import LoginDialog from "@/app/components/LoginDialog";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";
import { useWriteForm } from "@/lib/hooks/useWriteForm";
import { BRAND_COLOR, INK } from "@/lib/constants/theme";
import { fs, fw, lh } from "@/lib/styles/typography";

export default function WritePage() {
  const t = useT();
  const toast = useToast();
  const router = useRouter();
  const { locale } = useParams() as { locale: string };
  const [isAuthed, setIsAuthed] = useState(() => Boolean(tokenStorage.getAccessToken()));
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const {
    title, setTitle, content, setContent,
    tags, tagInput, setTagInput, sale, setSale,
    imageUrls, uploadingFiles, loading, setLoading,
    handleTagAdd, handleTagDelete, handleFilesSelected, handleImageRemove,
    buildItemPayload, validate,
  } = useWriteForm();

  const requireLogin = (): boolean => {
    if (!tokenStorage.getAccessToken()) {
      setIsAuthed(false);
      setLoginDialogOpen(true);
      return true;
    }
    return false;
  };

  const handleSaveDraft = async () => {
    if (requireLogin() || !validate(false)) return;
    setLoading(true);
    try {
      await createArticle({ title, content, tags, imageUrls, isPublished: false, item: buildItemPayload() });
      toast.success(t.write.draftSaved);
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.write.saveFailed} (${(e as ApiError).status})` : t.write.saveError);
    } finally { setLoading(false); }
  };

  const handlePublish = async () => {
    if (requireLogin() || !validate(true)) return;
    setLoading(true);
    try {
      const { id } = await createArticle({ title, content, tags, imageUrls, isPublished: true, item: buildItemPayload() });
      router.push(`/${locale}/article/${id}`);
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.write.publishFailed} (${(e as ApiError).status})` : t.write.publishError);
    } finally { setLoading(false); }
  };

  return (
    <>
      <LoginDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} onSuccess={() => setIsAuthed(true)} />
      {isAuthed ? (
        <>
          <WriteHeader onSaveDraft={handleSaveDraft} onPublish={handlePublish} loading={loading} />
          <Box sx={pageWithSidebar}>
            <Box sx={mainContent}>
              <WriteEditor
                title={title} content={content} tags={tags} tagInput={tagInput}
                imageUrls={imageUrls} uploadingFiles={uploadingFiles}
                onTitleChange={setTitle} onContentChange={setContent}
                onTagInputChange={setTagInput} onTagAdd={handleTagAdd}
                onTagDelete={handleTagDelete} onFilesSelected={handleFilesSelected}
                onImageRemove={handleImageRemove}
              />
            </Box>
            <Box sx={sidebarWidth}><WriteSaleSettings value={sale} onChange={setSale} /></Box>
          </Box>
          <Box sx={mobileSidebar}><WriteSaleSettings value={sale} onChange={setSale} /></Box>
        </>
      ) : (
        <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", px: 2, py: { xs: 6, md: 10 } }}>
          <Box
            sx={{
              ...panelBase,
              maxWidth: 520,
              width: "100%",
              p: { xs: 3, md: 5 },
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <Typography sx={{ fontFamily: "var(--font-pacifico)", fontSize: fs["6xl"], color: BRAND_COLOR, mb: 1 }}>
              Thingz
            </Typography>
            <Typography sx={{ fontSize: { xs: fs["3xl"], md: fs["4xl"] }, fontWeight: fw.bold, color: INK, lineHeight: lh.tight, mb: 1.5 }}>
              로그인 후 이야기를 기록해보세요
            </Typography>
            <Typography sx={{ fontSize: fs.md, color: "text.secondary", lineHeight: lh.normal, mb: 4 }}>
              내 물건의 사진과 기억, 판매 정보를 안전하게 저장하려면 로그인이 필요합니다.
            </Typography>
            <Button variant="contained" disableElevation onClick={() => setLoginDialogOpen(true)} sx={{ px: 4, py: 1.25, fontWeight: fw.semibold }}>
              로그인하기
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
