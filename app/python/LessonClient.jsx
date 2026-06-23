"use client";

import { useEffect } from "react";

// Wires up copy buttons and table-of-contents scroll-spy for the rendered lesson HTML.
export default function LessonClient() {
  useEffect(() => {
    const handlers = [];
    document.querySelectorAll(".ex-copy").forEach((btn) => {
      const onClick = () => {
        const code = btn.parentElement.querySelector("code");
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
      btn.addEventListener("click", onClick);
      handlers.push([btn, onClick]);
    });

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
      handlers.forEach(([btn, onClick]) => btn.removeEventListener("click", onClick));
      if (observer) observer.disconnect();
    };
  }, []);

  return null;
}
