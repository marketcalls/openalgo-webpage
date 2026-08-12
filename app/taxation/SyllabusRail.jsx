"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/taxationCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="taxation" basePath="/taxation" parts={PARTS} />;
}
