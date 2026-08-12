"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/fundamentalsCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="fundamentals" basePath="/fundamentals" parts={PARTS} />;
}
