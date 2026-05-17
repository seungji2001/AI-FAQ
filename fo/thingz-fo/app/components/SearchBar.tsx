"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { fs, dim } from "@/lib/styles/typography";
import { useT } from "@/lib/i18n/context";

const SearchBox = styled(Box)({
  backgroundColor: "rgba(0,0,0,0.05)",
  borderRadius: dim.radiusCard,
  padding: "10px 18px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
});

export default function SearchBar() {
  const t = useT();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/explore?tag=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <SearchBox>
      <SearchIcon sx={{ fontSize: 18, color: "text.disabled", flexShrink: 0 }} />
      <InputBase
        fullWidth
        placeholder={t.header.search}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        inputProps={{ "aria-label": "search" }}
        sx={{ fontSize: fs.md, color: "text.secondary" }}
      />
    </SearchBox>
  );
}
