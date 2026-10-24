import { redirect } from "next/navigation";

/**
 * `/projects` has no page of its own.
 *
 * The gallery on the home page *is* the index of the projects, and every record
 * has its own page at `/projects/<slug>`, so rather than answering the
 * segment's own address with a 404 the reader is sent to the gallery. The
 * anchor is the section's own id, so the header keeps working from here too.
 */
export default function ProjectsIndex(): never {
  redirect("/#work");
}
