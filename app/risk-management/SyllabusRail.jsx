"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/riskCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="risk-management" basePath="/risk-management" parts={PARTS} />;
}
