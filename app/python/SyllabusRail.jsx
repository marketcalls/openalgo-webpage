"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/pythonCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="python" basePath="/python" parts={PARTS} />;
}
