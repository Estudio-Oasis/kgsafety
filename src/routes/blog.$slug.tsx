import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SectionLabel } from "@/components/site/SectionLabel";
import { useT } from "@/i18n/context";
import { BLOG_POSTS, getBlogPostBySlug } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  loader: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.post.title} · KG Safety` },
      { name: "description", content: loaderData.post.excerpt },
      { property: "og:title", content: loaderData.post.title },
      { property: "og:description", content: loaderData.post.excerpt },
      { property: "og:url", content: `https://kgsafety.lovable.app/blog/${loaderData.post.slug}` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: loaderData.post.title },
      { name: "twitter:description", content: loaderData.post.excerpt },
    ],
    links: [{ rel: "canonical", href: `https://kgsafety.lovable.app/blog/${loaderData.post.slug}` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: loaderData.post.title,
          description: loaderData.post.excerpt,
          datePublished: loaderData.post.date,
          author: { "@type": "Organization", name: "KG Safety" },
          publisher: { "@type": "Organization", name: "KG Safety" },
        }),
      },
    ],
  }),
});

function BlogPostPage() {
  const { t } = useT();
  const { post } = Route.useLoaderData();

  return (
    <div>
      <section className="px-6 md:px-12 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-3xl">
          <SectionLabel>{post.tag}</SectionLabel>
          <h1 className="font-display text-3xl md:text-5xl uppercase leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-sm text-white/50 tracking-widest uppercase mb-8">{post.date}</p>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed">{post.excerpt}</p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 md:py-24 border-b border-white/5">
        <div className="max-w-3xl space-y-12">
          {post.content.map((section, i) => (
            <article key={i}>
              <h2 className="font-display text-xl uppercase mb-4 text-signal">{section.heading}</h2>
              <p className="text-base text-white/70 leading-relaxed">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-16 border-b border-white/5">
        <div className="max-w-3xl">
          <h3 className="font-display text-sm uppercase tracking-widest text-white/50 mb-6">{t("Más artículos")}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug)
              .slice(0, 2)
              .map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="bg-steel border border-white/10 p-6 hover:border-signal transition-colors"
                >
                  <span className="text-signal text-[10px] uppercase tracking-widest">{p.tag}</span>
                  <p className="font-display text-sm uppercase mt-2 leading-tight">{p.title}</p>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
