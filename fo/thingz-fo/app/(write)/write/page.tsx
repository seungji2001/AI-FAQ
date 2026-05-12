"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import WriteHeader from "@/app/components/write/WriteHeader";
import WriteEditor from "@/app/components/write/WriteEditor";
import WriteSaleSettings, { SaleSettingsValue } from "@/app/components/write/WriteSaleSettings";
import { createArticle } from "@/lib/api/articles";
import { uploadImage } from "@/lib/api/upload";
import { ApiError } from "@/lib/api/client";
import { ArticleCreateRequest } from "@/lib/types/article";
import { pageWithSidebar, sidebarWidth, mobileSidebar, mainContent } from "@/lib/styles/sx";
import { tokenStorage } from "@/lib/auth/token";
import LoginDialog from "@/app/components/LoginDialog";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";

const DEFAULT_SALE: SaleSettingsValue = {
  isSale: true, price: "", condition: "A", delivery: "택배", instagramId: "", kakaoUrl: "",
};

export default function WritePage() {
  const t = useT();
  const toast = useToast();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sale, setSale] = useState<SaleSettingsValue>(DEFAULT_SALE);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const requireLogin = (): boolean => {
    if (!tokenStorage.getAccessToken()) { setLoginDialogOpen(true); return true; }
    return false;
  };

  useEffect(() => { requireLogin(); }, []);

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

  const buildPayload = (isPublished: boolean): ArticleCreateRequest => ({
    title, content, tags, imageUrls, isPublished,
    item: sale.isSale
      ? { forSale: true, price: parseInt(sale.price.replace(/,/g, ""), 10) || 0, condition: sale.condition, tradeType: sale.delivery }
      : { forSale: false },
  });

  const handleSaveDraft = async () => {
    if (requireLogin()) return;
    if (!title.trim()) return void toast.warn(t.write.titleRequired);
    if (uploadingFiles.length > 0) return void toast.warn(t.write.uploading);
    setLoading(true);
    try {
      await createArticle(buildPayload(false));
      toast.success(t.write.draftSaved);
    } catch (e) {
      toast.error(e instanceof ApiError ? `${t.write.saveFailed} (${(e as ApiError).status})` : t.write.saveError);
    } finally { setLoading(false); }
  };

  const handlePublish = async () => {
    if (requireLogin()) return;
    if (!title.trim()) return void toast.warn(t.write.titleRequired);
    if (!content.trim()) return void toast.warn(t.write.contentRequired);
    if (uploadingFiles.length > 0) return void toast.warn(t.write.uploading);
    setLoading(true);
    try {
      const { id } = await createArticle(buildPayload(true));
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
