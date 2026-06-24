"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import ArticleTrade from "@/app/components/article/ArticleTrade";
import ArticleEditorProfile from "@/app/components/article/ArticleEditorProfile";
import { ArticleDetail } from "@/lib/types/article";
import { getUserFromToken } from "@/lib/auth/token";
import { useAccessToken } from "@/lib/auth/useAccessToken";
import { reportArticle } from "@/lib/api/articles";
import { useT } from "@/lib/i18n/context";
import { useToast } from "@/app/components/ui/Toast";

interface Props {
  article: ArticleDetail;
}

export default function SidePanel({ article }: Props) {
  const t = useT();
  const toast = useToast();
  const accessToken = useAccessToken();
  const currentUser = accessToken ? getUserFromToken(accessToken) : null;
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { item, authorId, author, authorAvatarUrl, authorBio, authorArticles, authorFollowers } = article;
  const canReport = Boolean(currentUser && currentUser.userId !== authorId);

  const handleReport = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      await reportArticle(article.id, reason.trim());
      setReportOpen(false);
      setReason("");
      toast.success(t.report.success);
    } catch {
      toast.error(t.report.failed);
    } finally {
      setSubmitting(false);
    }
  };

  const editorProps = {
    userId: authorId,
    username: `@${author}`,
    bio: authorBio ?? "",
    articles: authorArticles,
    followers: String(authorFollowers),
    avatarSrc: authorAvatarUrl ?? undefined,
  };

  const tradeProps = item
    ? {
        price: `${item.price?.toLocaleString()}원`,
        trade: {
          condition: `${item.condition}급`,
          delivery: item.tradeType,
        },
        seller: {
          userId: authorId,
          username: `@${author}`,
          avatarSrc: authorAvatarUrl ?? undefined,
        },
      }
    : null;

  return (
    <>
      {tradeProps && <ArticleTrade {...tradeProps} />}
      <ArticleEditorProfile {...editorProps} />
      {canReport && (
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button size="small" color="inherit" startIcon={<FlagOutlinedIcon />} onClick={() => setReportOpen(true)}>
            {t.report.button}
          </Button>
        </Box>
      )}
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t.report.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "text.secondary", mb: 2 }}>{t.report.description}</Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t.report.placeholder}
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportOpen(false)}>{t.mypage.cancel}</Button>
          <Button variant="contained" color="error" disabled={submitting || !reason.trim()} onClick={handleReport}>
            {t.report.submit}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
