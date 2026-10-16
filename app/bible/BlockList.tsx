import type { BibleBlock } from "../../content/bible";
import { CopyButton } from "./CopyButton";

export function BlockList({ blocks }: { blocks: BibleBlock[] }) {
  return (
    <div className="bibleBody">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "kicker":
            return (
              <p className="tag" key={key}>
                {block.text}
              </p>
            );
          case "h2":
            return <h2 key={key}>{block.text}</h2>;
          case "h3":
            return <h3 key={key}>{block.text}</h3>;
          case "p":
            return <p key={key}>{block.text}</p>;
          case "lede":
            return (
              <p className="lede" key={key}>
                {block.text}
              </p>
            );
          case "quote":
            return (
              <blockquote className="bibleQuote" key={key}>
                <p>{block.text}</p>
                {block.cite ? <cite>{block.cite}</cite> : null}
              </blockquote>
            );
          case "list":
            return (
              <ul className="bibleList" key={key}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "numbered":
            return (
              <ol className="bibleNumbered" key={key}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div className="bibleTableWrap" key={key}>
                <table className="bibleTable">
                  <thead>
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header} scope="col">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row) => (
                      <tr key={row.join("-")}>
                        {row.map((cell, cellIndex) => (
                          <td key={`${cell}-${cellIndex}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout":
            return (
              <aside className="bibleCallout" key={key}>
                <b>{block.label}</b>
                <p>{block.text}</p>
              </aside>
            );
          case "creed":
            return (
              <p className="bibleCreedBlock" key={key}>
                {block.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            );
          case "prompt":
            return (
              <article className="biblePrompt" key={block.id}>
                <header>
                  <h3>{block.title}</h3>
                  <CopyButton
                    text={
                      block.negative
                        ? `${block.body}\n\nNEGATIVE:\n${block.negative}`
                        : block.body
                    }
                  />
                </header>
                <pre>{block.body}</pre>
                {block.negative ? (
                  <p className="neg">
                    <b>Negative lock</b>
                    {block.negative}
                  </p>
                ) : null}
              </article>
            );
          case "links":
            return (
              <ul className="bibleLinks" key={key}>
                {block.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      {...(item.external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                    >
                      {item.label}
                      {item.external ? " ↗" : ""}
                    </a>
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <div className="bibleCode" key={key}>
                <header>
                  {block.label ? <b>{block.label}</b> : <span />}
                  <CopyButton text={block.text} label="Copy block" />
                </header>
                <pre>{block.text}</pre>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
