"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import WriteHeader from "@/app/components/write/WriteHeader";
import WriteEditor from "@/app/components/write/WriteEditor";
import WriteSaleSettings, { SaleSettingsValue } from "@/app/components/write/WriteSaleSettings";
import { fetchArticleForEdit, updateArticle, publishDraft } from "@/lib/api/articles";
import { uploadImage } from "@/lib/api/upload";
import { ApiError } from "@/lib/api/client";
import { ArticleDetail, ArticleUpdateRequest } from "@/lib/types/article";
import { pageWithSidebar, sidebarWidth, mobileSidebar, mainContent } from "@/lib/styles/sx";
import { tokenStorage } from "@/lib/auth/token";
import { textSecondary } from "@/lib/styles/typography";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";

function toSaleSettings(article: ArticleDetail): SaleSettingsValue {
  if (!article.item) {
    return { isSale: false, price: "", condition: "A", delivery: "택배", instagramId: article.authorInstagramId ?? "", kakaoUrl: article.authorKakaoUrl ?? "" };
  }
  return {
    isSale: true, price: String(article.item.price),
    condition: article.item.condition, delivery: article.item.tradeType,
    instagramId: article.authorInstagramId ?? "", kakaoUrl: article.authorKakaoUrl ?? "",
  };
}

interface Props { params: Promise<{ id: string }> }

export default function EditPage({ params }: Props) {
  const { id } = use(params);
  const t = useT();
  const toast = useToast();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sale, setSale] = useState<SaleSettingsValue>({ isSale: false, price: "", condition: "A", delivery: "택배", instagramId: "", kakaoUrl: "" });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenStorage.getAccessToken()) { router.replace("/"); return; }
    fetchArticleForEdit(id)
      .then((a) => { setArticle(a); setTitle(a.title); setContent(a.content); setTags(a.tags); setImageUrls(a.imageUrls); setSale(toSaleSettings(a)); })
      .catch(() => setFetchError(true));
  }, [id, router]);

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const tag = tagInput.startsWith("#") ? tagInput.trim() : `#${tagInput.trim()}`;
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    const remaining = 10 - imageUrls.length - uploadingFiles.length;
    const toUpload = files.slice(0, remaining);
    if (toUpload.length === 0) return;
    const newUploading = toUpload.map((f) => ({ id: crypto.randomUUID(), name: f.name, progress: 0 }));
    setUploadingFiles((prev) => [...prev, ...newUploading]);
    const results = await Promise.allSettled(
      toUpload.map((file, i) => uploadImage(file, (pct) =>
        setUploadingFiles((prev) => prev.map((u) => (u.id === newUploading[i].id ? { ...u, progress: pct } : u)))
      ))
    );
    const uploaded: string[] = [];
    let failCount = 0;
    results.forEach((r) => { if (r.status === "fulfilled") uploaded.push(r.value); else failCount++; });
    setImageUrls((prev) => [...prev, ...uploaded]);
    setUploadingFiles((prev) => prev.filter((u) => !newUploading.some((n) => n.id === u.id)));
    if (failCount > 0) toast.error(`${failCount}${t.write.uploadFailed}`);
  };

  const buildPayload = (): ArticleUpdateRequest => ({
    title, content, tags, imageUrls,
    item: sale.isSale
      ? { forSale: true, price: parseInt(sale.price.replace(/,/g, ""), 10) || 0, condition: sale.condition, tradeType: sale.delivery }
      : { forSale: false },
  });

  const handleSave = async () => {
    if (!title.trim()) return void toast.warn(t.write.titleRequired);
    if (uploadingFiles.length > 0) return void toast.warn(t.write.uploading);
    setLoading(true);
    try { await updateArticle(id, buildPayload()); toast.success(t.write.draftSaved); }
    catch (e) { toast.error(e instanceof ApiError ? `${t.write.saveFailed} (${(e as ApiError).status})` : t.write.saveError); }
    finally { setLoading(false); }
  };

  const handlePublish = async () => {
    if (!title.trim()) return void toast.warn(t.write.titleRequired);
    if (!content.trim()) return void toast.warn(t.write.contentRequired);
    if (uploadingFiles.length > 0) return void toast.warn(t.write.uploading);
    setLoading(true);
    try {
      await updateArticle(id, buildPayload());
      if (article && !article.publishedAt) await publishDraft(id);
      router.push(`/article/${id}`);
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.write.publishFailed} (${(e as ApiError).status})` : t.write.publishError);
    } finally { setLoading(false); }
  };

  if (fetchError) return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography sx={textSecondary}>{t.common.noArticles}</Typography>
    </Box>
  );
  if (!article) return null;

  return (
    <>
      <WriteHeader onSaveDraft={handleSave} onPublish={handlePublish} loading={loading} />
      <Box sx={pageWithSidebar}>
        <Box sx={mainContent}>
          <WriteEditor title={title} content={content} tags={tags} tagInput={tagInput}
            imageUrls={imageUrls} uploadingFiles={uploadingFiles}
            onTitleChange={setTitle} onContentChange={setContent} onTagInputChange={setTagInput}
            onTagAdd={handleTagAdd} onTagDelete={(tag) => setTags(tags.filter((t) => t !== tag))}
            onFilesSelected={handleFilesSelected} onImageRemove={(i) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </Box>
        <Box sx={sidebarWidth}><WriteSaleSettings value={sale} onChange={setSale} /></Box>
      </Box>
      <Box sx={mobileSidebar}><WriteSaleSettings value={sale} onChange={setSale} /></Box>
    </>
  );
}
