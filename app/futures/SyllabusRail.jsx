"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/futuresCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="futures" basePath="/futures" parts={PARTS} />;
}
