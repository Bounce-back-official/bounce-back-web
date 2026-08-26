import { site } from "@/lib/site";

export function LineFloat() {
  return (
    <a
      className="line-float"
      href={site.lineUrl}
      target="_blank"
      rel="noopener"
      aria-label="เพิ่มเพื่อน LINE OA"
    >
      <span aria-hidden="true" />
      <b>{site.lineLabel}</b>
    </a>
  );
}
