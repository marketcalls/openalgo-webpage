"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/amibrokerCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="amibroker" basePath="/amibroker" parts={PARTS} />;
}
