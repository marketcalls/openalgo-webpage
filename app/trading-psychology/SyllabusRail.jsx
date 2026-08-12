"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/psychologyCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="trading-psychology" basePath="/trading-psychology" parts={PARTS} />;
}
