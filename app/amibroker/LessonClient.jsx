"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Wires up copy buttons and table-of-contents scroll-spy for the rendered lesson HTML.
// Copy uses EVENT DELEGATION (a single document listener) so it keeps working no matter
// when the code blocks render or how the user navigates between chapters - the previous
// per-button binding stopped firing after client-side navigation. The scroll-spy re-binds
// whenever the path changes.
export default function LessonClient() {
  const pathname = usePathname();

  useEffect(() => {
    // --- copy buttons: one delegated listener handles every .ex-copy on the page ---
    const onClick = (e) => {
      const btn = e.target.closest(".ex-copy");
      if (!btn) return;
      const code = btn.parentElement && btn.parentElement.querySelector("code");
      if (!code) return;
      navigator.clipboard.writeText(code.innerText).then(() => {
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = "Copy";
          btn.classList.remove("copied");
        }, 1500);
      });
    };
    document.addEventListener("click", onClick);

    // --- table-of-contents scroll-spy ---
    const links = Array.from(document.querySelectorAll(".toc-link"));
    const map = new Map();
    links.forEach((a) => {
      const target = document.getElementById(a.getAttribute("href").slice(1));
      if (target) map.set(target, a);
    });
    let observer;
    if (map.size) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              links.forEach((l) => l.classList.remove("active"));
              const a = map.get(entry.target);
              if (a) a.classList.add("active");
            }
          });
        },
        { rootMargin: "-80px 0px -70% 0px" },
      );
      map.forEach((_a, target) => observer.observe(target));
    }

    return () => {
      document.removeEventListener("click", onClick);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}
