"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/technicalsCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="technicals" basePath="/technicals" parts={PARTS} />;
}
