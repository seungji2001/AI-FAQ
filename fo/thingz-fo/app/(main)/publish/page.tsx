import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FeaturedCard from "@/app/components/FeaturedCard";
import ItemCard from "@/app/components/ItemCard";
import EditorItem from "@/app/components/EditorItem";
import TodayEditors from "@/app/components/TodayEditors";
import ArticleContent from "@/app/components/article/ArticleContent";
import ArticleTrade from "@/app/components/article/ArticleTrade";
import ArticleEditorProfile from "@/app/components/article/ArticleEditorProfile";

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 2 }}>
        {title}
      </Typography>
      <Divider sx={{ my: 1, mb: 3 }} />
      {children}
    </Box>
  );
}

export default function PublishPage() {
  return (
    <Box>
      <Section title="FeaturedCard">
        <FeaturedCard />
      </Section>

      <Section title="ItemCard">
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
          <ItemCard />
          <ItemCard />
          <ItemCard />
        </Box>
      </Section>

      <Section title="EditorItem">
        <EditorItem />
      </Section>

      <Section title="TodayEditors">
        <Box sx={{ maxWidth: 360 }}>
          <TodayEditors />
        </Box>
      </Section>

      <Section title="ArticleContent">
        <ArticleContent />
      </Section>

      <Section title="ArticleTrade">
        <Box sx={{ maxWidth: 460 }}>
          <ArticleTrade />
        </Box>
      </Section>

      <Section title="ArticleEditorProfile">
        <Box sx={{ maxWidth: 460 }}>
          <ArticleEditorProfile />
        </Box>
      </Section>
    </Box>
  );
}
