"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/api/upload";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";
import { SaleSettingsValue } from "@/app/components/write/WriteSaleSettings";

export interface WriteFormState {
  title: string;
  content: string;
  tags: string[];
  tagInput: string;
  sale: SaleSettingsValue;
  imageUrls: string[];
  uploadingFiles: { id: string; name: string; progress: number }[];
  loading: boolean;
}

export const DEFAULT_SALE: SaleSettingsValue = {
  isSale: true, price: "", condition: "A", delivery: "택배", instagramId: "", kakaoUrl: "",
};

export function useWriteForm(initialState?: Partial<WriteFormState>) {
  const t = useT();
  const toast = useToast();

  const [title, setTitle] = useState(initialState?.title ?? "");
  const [content, setContent] = useState(initialState?.content ?? "");
  const [tags, setTags] = useState<string[]>(initialState?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [sale, setSale] = useState<SaleSettingsValue>(initialState?.sale ?? DEFAULT_SALE);
  const [imageUrls, setImageUrls] = useState<string[]>(initialState?.imageUrls ?? []);
  const [uploadingFiles, setUploadingFiles] = useState<{ id: string; name: string; progress: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      const tag = tagInput.startsWith("#") ? tagInput.trim() : `#${tagInput.trim()}`;
      if (!tags.includes(tag)) setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  };

  const handleTagDelete = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

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
    results.forEach((r) => { if (r.status === "fulfilled") uploaded.push(r.value); else failCount++; });

    setImageUrls((prev) => [...prev, ...uploaded]);
    setUploadingFiles((prev) => prev.filter((u) => !newUploading.some((n) => n.id === u.id)));
    if (failCount > 0) toast.error(`${failCount}${t.write.uploadFailed}`);
  };

  const buildItemPayload = () =>
    sale.isSale
      ? { forSale: true as const, price: parseInt(sale.price.replace(/,/g, ""), 10) || 0, condition: sale.condition, tradeType: sale.delivery }
      : { forSale: false as const };

  const validate = (requireContent = false): boolean => {
    if (!title.trim()) { toast.warn(t.write.titleRequired); return false; }
    if (requireContent && !content.trim()) { toast.warn(t.write.contentRequired); return false; }
    if (uploadingFiles.length > 0) { toast.warn(t.write.uploading); return false; }
    return true;
  };

  return {
    title, setTitle,
    content, setContent,
    tags, setTags,
    tagInput, setTagInput,
    sale, setSale,
    imageUrls, setImageUrls,
    uploadingFiles,
    loading, setLoading,
    handleTagAdd, handleTagDelete,
    handleFilesSelected,
    handleImageRemove: (i: number) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i)),
    buildItemPayload,
    validate,
  };
}
