type JsonLdProps = {
  data: object | object[];
};

/** Renders schema.org JSON-LD for search engines (not executable script). */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
