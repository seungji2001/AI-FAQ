"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import WriteHeader from "@/app/components/write/WriteHeader";
import WriteEditor from "@/app/components/write/WriteEditor";
import WriteSaleSettings, { SaleSettingsValue } from "@/app/components/write/WriteSaleSettings";
import { createArticle } from "@/lib/api/articles";
import { ApiError } from "@/lib/api/client";
import { ArticleCreateRequest } from "@/lib/types/article";
import { pageWithSidebar, sidebarWidth, mobileSidebar, mainContent } from "@/lib/styles/sx";

const TEMP_USER_ID = "00000000-0000-0000-0000-000000000001";

const DEFAULT_SALE: SaleSettingsValue = {
  isSale: true,
  price: "",
  condition: "A급",
  delivery: "택배",
  instagramId: "",
  kakaoUrl: "",
};

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [sale, setSale] = useState<SaleSettingsValue>(DEFAULT_SALE);
  const [loading, setLoading] = useState(false);

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const tag = tagInput.startsWith("#") ? tagInput.trim() : `#${tagInput.trim()}`;
      if (!tags.includes(tag)) setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleTagDelete = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const buildPayload = (): ArticleCreateRequest => ({
    userId: TEMP_USER_ID,
    title,
    content,
    tags,
    imageUrls: [],
    item: sale.isSale
      ? {
          forSale: true,
          price: parseInt(sale.price.replace(/,/g, ""), 10) || 0,
          condition: sale.condition.replace("급", ""),
          tradeType: sale.delivery,
        }
      : { forSale: false },
  });

  const handleSaveDraft = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    setLoading(true);
    try {
      await createArticle(buildPayload());
      alert("임시저장 완료!");
    } catch (e) {
      const msg = e instanceof ApiError ? `저장 실패 (${e.status})` : "저장 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!content.trim()) return alert("본문을 입력해주세요.");
    setLoading(true);
    try {
      const { id } = await createArticle(buildPayload());
      router.push(`/article/${id}`);
    } catch (e) {
      const msg = e instanceof ApiError ? `발행 실패 (${e.status})` : "발행 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WriteHeader onSaveDraft={handleSaveDraft} onPublish={handlePublish} loading={loading} />
      <Box sx={pageWithSidebar}>
        <Box sx={mainContent}>
          <WriteEditor
            title={title} content={content} tags={tags} tagInput={tagInput}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onTagInputChange={setTagInput}
            onTagAdd={handleTagAdd}
            onTagDelete={handleTagDelete}
          />
        </Box>
        <Box sx={sidebarWidth}>
          <WriteSaleSettings value={sale} onChange={setSale} />
        </Box>
      </Box>

      {/* 모바일 */}
      <Box sx={mobileSidebar}>
        <WriteSaleSettings value={sale} onChange={setSale} />
      </Box>
    </>
  );
}
