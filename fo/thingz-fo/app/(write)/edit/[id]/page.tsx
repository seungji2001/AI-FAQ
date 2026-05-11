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

const CONDITIONS = ["S급", "A급", "B급", "C급"];

function toSaleSettings(article: ArticleDetail): SaleSettingsValue {
  if (!article.item) {
    return { isSale: false, price: "", condition: "A급", delivery: "택배", instagramId: article.authorInstagramId ?? "", kakaoUrl: article.authorKakaoUrl ?? "" };
  }
  const conditionLabel = CONDITIONS.find((c) => c.startsWith(article.item!.condition)) ?? "A급";
  return {
    isSale: true,
    price: String(article.item.price),
    condition: conditionLabel,
    delivery: article.item.tradeType,
    instagramId: article.authorInstagramId ?? "",
    kakaoUrl: article.authorKakaoUrl ?? "",
  };
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sale, setSale] = useState<SaleSettingsValue>({ isSale: false, price: "", condition: "A급", delivery: "택배", instagramId: "", kakaoUrl: "" });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tokenStorage.getAccessToken()) { router.replace("/"); return; }
    fetchArticleForEdit(id)
      .then((a) => {
        setArticle(a);
        setTitle(a.title);
        setContent(a.content);
        setTags(a.tags);
        setImageUrls(a.imageUrls);
        setSale(toSaleSettings(a));
      })
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
      toUpload.map((file, i) =>
        uploadImage(file, (pct) =>
          setUploadingFiles((prev) =>
            prev.map((u) => (u.id === newUploading[i].id ? { ...u, progress: pct } : u))
          )
        )
      )
    );

    const uploaded: string[] = [];
    let failCount = 0;
    results.forEach((result) => {
      if (result.status === "fulfilled") uploaded.push(result.value);
      else failCount++;
    });

    setImageUrls((prev) => [...prev, ...uploaded]);
    setUploadingFiles((prev) => prev.filter((u) => !newUploading.some((n) => n.id === u.id)));
    if (failCount > 0) alert(`${failCount}개 이미지 업로드에 실패했습니다.`);
  };

  const buildPayload = (): ArticleUpdateRequest => ({
    title,
    content,
    tags,
    imageUrls,
    item: sale.isSale
      ? { forSale: true, price: parseInt(sale.price.replace(/,/g, ""), 10) || 0, condition: sale.condition.replace("급", ""), tradeType: sale.delivery }
      : { forSale: false },
  });

  const handleSave = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (uploadingFiles.length > 0) return alert("이미지 업로드 중입니다. 잠시 후 다시 시도해주세요.");
    setLoading(true);
    try {
      await updateArticle(id, buildPayload());
      alert("저장 완료!");
    } catch (e) {
      alert(e instanceof ApiError ? `저장 실패 (${e.status})` : "저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!content.trim()) return alert("본문을 입력해주세요.");
    if (uploadingFiles.length > 0) return alert("이미지 업로드 중입니다. 잠시 후 다시 시도해주세요.");
    setLoading(true);
    try {
      await updateArticle(id, buildPayload());
      if (article && !article.publishedAt) {
        await publishDraft(id);
      }
      router.push(`/article/${id}`);
    } catch (e) {
      alert(e instanceof ApiError ? `발행 실패 (${e.status})` : "발행 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography sx={textSecondary}>아티클을 불러올 수 없습니다.</Typography>
      </Box>
    );
  }

  if (!article) return null;

  return (
    <>
      <WriteHeader onSaveDraft={handleSave} onPublish={handlePublish} loading={loading} />
      <Box sx={pageWithSidebar}>
        <Box sx={mainContent}>
          <WriteEditor
            title={title} content={content} tags={tags} tagInput={tagInput}
            imageUrls={imageUrls} uploadingFiles={uploadingFiles}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onTagInputChange={setTagInput}
            onTagAdd={handleTagAdd}
            onTagDelete={(tag) => setTags(tags.filter((t) => t !== tag))}
            onFilesSelected={handleFilesSelected}
            onImageRemove={(i) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </Box>
        <Box sx={sidebarWidth}>
          <WriteSaleSettings value={sale} onChange={setSale} />
        </Box>
      </Box>
      <Box sx={mobileSidebar}>
        <WriteSaleSettings value={sale} onChange={setSale} />
      </Box>
    </>
  );
}
