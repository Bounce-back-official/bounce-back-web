import type { PortableTextBlock } from "@portabletext/types";
import { PortableText, type PortableTextComponents } from "next-sanity";

import { urlFor } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      const url = urlFor(value).width(1200).fit("max").auto("format").url();
      return (
        <figure style={{ margin: "28px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={value.alt || ""}
            style={{ width: "100%", height: "auto", borderRadius: 10, display: "block" }}
          />
          {value.caption && (
            <figcaption
              style={{ marginTop: 8, fontSize: 13, color: "rgba(14,14,16,.5)", textAlign: "center" }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
