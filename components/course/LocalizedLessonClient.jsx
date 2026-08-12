"use client";

import { useI18n } from "@/components/i18n/LanguageProvider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LocalizedLessonClient() {
  const pathname = usePathname();
  const { lang, t } = useI18n();
  const copyLabel = t("courseNav.copy");
  const copiedLabel = t("courseNav.copied");

  useEffect(() => {
    const timers = new Set();
    let tocObserver;
    let refreshFrame;

    const updateCopyButtons = () => {
      document.querySelectorAll(".ex-copy").forEach((button) => {
        const label = button.classList.contains("copied") ? copiedLabel : copyLabel;
        if (button.textContent !== label) button.textContent = label;
      });
    };

    const observeToc = () => {
      if (tocObserver) tocObserver.disconnect();

      const links = Array.from(document.querySelectorAll(".toc-link"));
      const targets = new Map();
      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;
        const target = document.getElementById(href.slice(1));
        if (target) targets.set(target, link);
      });

      if (!targets.size) return;

      tocObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => link.classList.remove("active"));
            targets.get(entry.target)?.classList.add("active");
          });
        },
        { rootMargin: "-80px 0px -70% 0px" },
      );
      targets.forEach((_link, target) => tocObserver.observe(target));
    };

    const refresh = () => {
      updateCopyButtons();
      observeToc();
    };

    const scheduleRefresh = () => {
      if (refreshFrame) cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(refresh);
    };

    const onClick = (event) => {
      const button = event.target instanceof Element ? event.target.closest(".ex-copy") : null;
      if (!button) return;

      const code = button.parentElement?.querySelector("code");
      if (!code) return;

      navigator.clipboard.writeText(code.innerText).then(() => {
        button.textContent = copiedLabel;
        button.classList.add("copied");

        const timer = setTimeout(() => {
          button.textContent = copyLabel;
          button.classList.remove("copied");
          timers.delete(timer);
        }, 1500);
        timers.add(timer);
      });
    };

    document.addEventListener("click", onClick);
    refresh();

    const contentObserver = new MutationObserver(scheduleRefresh);
    contentObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("click", onClick);
      contentObserver.disconnect();
      if (tocObserver) tocObserver.disconnect();
      if (refreshFrame) cancelAnimationFrame(refreshFrame);
      timers.forEach(clearTimeout);
    };
  }, [pathname, lang, copyLabel, copiedLabel]);

  return null;
}
