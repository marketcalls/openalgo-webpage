"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/statsArbCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="stats-arb" basePath="/stats-arb" parts={PARTS} />;
}
