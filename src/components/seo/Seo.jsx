import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SITE_URL,
  pageSeo,
  structuredData,
  socialMeta,
  twitterMeta,
} from "../../data/seo";

// Build-time HTML contains the same metadata; update it after client navigation.
export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pageSeo(pathname);
    document.title = page.title;
    const set = (attribute, key, value) => {
      let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.append(element);
      }
      element.content = value;
    };
    set("name", "description", page.description);
    set("name", "robots", page.noindex ? "noindex, follow" : "index, follow");
    Object.entries(socialMeta(page)).forEach(([key, value]) =>
      set("property", `og:${key}`, value),
    );
    Object.entries(twitterMeta(page)).forEach(([key, value]) =>
      set("name", `twitter:${key}`, value),
    );
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (page.noindex) canonical?.remove();
    else {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.append(canonical);
      }
      canonical.href = `${SITE_URL}${page.path}`;
    }
    let schema = document.getElementById("school-schema");
    const data = structuredData(pathname);
    if (!data) schema?.remove();
    else {
      if (!schema) {
        schema = document.createElement("script");
        schema.id = "school-schema";
        schema.type = "application/ld+json";
        document.head.append(schema);
      }
      schema.textContent = JSON.stringify(data);
    }
  }, [pathname]);
  return null;
}
