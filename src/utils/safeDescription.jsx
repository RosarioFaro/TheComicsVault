import parse, { domToReact } from "html-react-parser";

export default function safeDescription(html) {
  if (!html) return "";
  let cleaned = html.replace(
    /<a\b[^>]*href=['"]https:\/\/comicvine1\.cbsistatic\.com\/[^'"]+\.(jpg|jpeg|png|gif)['"][^>]*>.*?<\/a>/gi,
    ""
  );
  cleaned = cleaned.replace(/<img\b[^>]*>/gi, "");
  return parse(cleaned, {
    replace: (domNode) => {
      if (domNode.name === "a" && domNode.attribs && domNode.attribs.href && domNode.attribs.href.startsWith("/")) {
        const match = domNode.attribs.href.match(/^\/(\w+)\//);
        const sezione = match?.[1];
        if (sezione !== "volumes" && sezione !== "publisher") {
          return <span>{domToReact(domNode.children)}</span>;
        }
      }
    },
  });
}
