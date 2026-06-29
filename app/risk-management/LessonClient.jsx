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
        }).catch(() => {
          btn.textContent = "Copy failed";
          setTimeout(() => {
            btn.textContent = "Copy";
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

    let active = null;
    const onScroll = () => {
      let current = null;
      for (const [target] of map) {
        const rect = target.getBoundingClientRect();
        if (rect.top <= 120) current = target;
      }
      if (current && current !== active) {
        if (active && map.get(active)) map.get(active).classList.remove("active");
        map.get(current).classList.add("active");
        active = current;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      handlers.forEach(([btn, onClick]) => btn.removeEventListener("click", onClick));
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
