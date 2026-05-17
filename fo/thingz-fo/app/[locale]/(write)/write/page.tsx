"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import WriteHeader from "@/app/components/write/WriteHeader";
import WriteEditor from "@/app/components/write/WriteEditor";
import WriteSaleSettings from "@/app/components/write/WriteSaleSettings";
import { createArticle } from "@/lib/api/articles";
import { ApiError } from "@/lib/api/client";
import { pageWithSidebar, sidebarWidth, mobileSidebar, mainContent } from "@/lib/styles/sx";
import { tokenStorage } from "@/lib/auth/token";
import LoginDialog from "@/app/components/LoginDialog";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";
import { useWriteForm } from "@/lib/hooks/useWriteForm";

export default function WritePage() {
  const t = useT();
  const toast = useToast();
  const router = useRouter();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const {
    title, setTitle, content, setContent,
    tags, tagInput, setTagInput, sale, setSale,
    imageUrls, uploadingFiles, loading, setLoading,
    handleTagAdd, handleTagDelete, handleFilesSelected, handleImageRemove,
    buildItemPayload, validate,
  } = useWriteForm();

  const requireLogin = (): boolean => {
    if (!tokenStorage.getAccessToken()) { setLoginDialogOpen(true); return true; }
    return false;
  };

  useEffect(() => { requireLogin(); }, []);

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
      router.push(`/article/${id}`);
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.write.publishFailed} (${(e as ApiError).status})` : t.write.publishError);
    } finally { setLoading(false); }
  };

  return (
    <>
      <LoginDialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} />
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
  );
}
