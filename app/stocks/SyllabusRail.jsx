"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/stocksCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="stocks" basePath="/stocks" parts={PARTS} />;
}
