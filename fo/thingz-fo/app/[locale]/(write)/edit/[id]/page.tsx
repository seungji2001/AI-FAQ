"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import WriteHeader from "@/app/components/write/WriteHeader";
import WriteEditor from "@/app/components/write/WriteEditor";
import WriteSaleSettings from "@/app/components/write/WriteSaleSettings";
import { fetchArticleForEdit, updateArticle } from "@/lib/api/articles";
import { ApiError } from "@/lib/api/client";
import { pageWithSidebar, sidebarWidth, mobileSidebar, mainContent } from "@/lib/styles/sx";
import { tokenStorage } from "@/lib/auth/token";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";
import { useWriteForm, DEFAULT_SALE } from "@/lib/hooks/useWriteForm";
import { SaleSettingsValue } from "@/app/components/write/WriteSaleSettings";

export default function EditPage() {
  const t = useT();
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [ready, setReady] = useState(false);

  const {
    title, setTitle, content, setContent,
    tags, setTags, tagInput, setTagInput,
    sale, setSale, imageUrls, setImageUrls,
    uploadingFiles, loading, setLoading,
    handleTagAdd, handleTagDelete, handleFilesSelected, handleImageRemove,
    buildItemPayload, validate,
  } = useWriteForm();

  useEffect(() => {
    if (!tokenStorage.getAccessToken()) { router.replace("/"); return; }

    fetchArticleForEdit(id)
      .then((article) => {
        setTitle(article.title);
        setContent(article.content ?? "");
        setTags(article.tags ?? []);
        setImageUrls(article.imageUrls ?? []);
        if (article.item) {
          setSale({
            isSale: true,
            price: String(article.item.price ?? ""),
            condition: article.item.condition ?? "A",
            delivery: article.item.tradeType ?? "택배",
            instagramId: "",
            kakaoUrl: "",
          } as SaleSettingsValue);
        } else {
          setSale({ ...DEFAULT_SALE, isSale: false });
        }
        setReady(true);
      })
      .catch(() => {
        toast.error("아티클을 불러올 수 없습니다.");
        router.replace("/");
      });
  }, [id]);

  const handleSaveDraft = async () => {
    if (!validate(false)) return;
    setLoading(true);
    try {
      await updateArticle(id, { title, content, tags, imageUrls, item: buildItemPayload() });
      toast.success(t.write.draftSaved);
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.write.saveFailed} (${(e as ApiError).status})` : t.write.saveError);
    } finally { setLoading(false); }
  };

  const handlePublish = async () => {
    if (!validate(true)) return;
    setLoading(true);
    try {
      await updateArticle(id, { title, content, tags, imageUrls, item: buildItemPayload() });
      router.push(`/article/${id}`);
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.write.publishFailed} (${(e as ApiError).status})` : t.write.publishError);
    } finally { setLoading(false); }
  };

  if (!ready) return null;

  return (
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
  );
}
