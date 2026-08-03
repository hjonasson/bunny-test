export interface DebugOptions {
  maxLength?: number;
  log?: boolean;
  roles?: boolean;
}

type DebugResult = {
  found: boolean;
  dom: string | null;
};

interface DebugRoleResult {
  role: string;
  names: string[];
}

export async function renderDebug(
  evaluate: <T = unknown>(script: string) => Promise<T>,
  selector: string | null | undefined,
  options: DebugOptions = {},
  description?: string,
): Promise<string> {
  const selectorExpr =
    selector === undefined ? "undefined" : JSON.stringify(selector);
  const maxLengthExpr =
    options.maxLength === undefined
      ? "undefined"
      : JSON.stringify(options.maxLength);
  const result = await evaluate<DebugResult>(`(() => {
    const selector = ${selectorExpr};
    const root =
      selector === undefined
        ? document.body
        : selector
          ? document.querySelector(selector)
          : null;

    if (!root) {
      return { found: false, dom: null };
    }

    return {
      found: true,
      dom: window.__TL__.prettyDOM(root, ${maxLengthExpr}),
    };
  })()`);

  const roles = options.roles
    ? await evaluate<DebugRoleResult[]>(`(() => {
        const selector = ${selectorExpr};
        const root =
          selector === undefined
            ? document.body
            : selector
              ? document.querySelector(selector)
              : null;

        if (!root) return [];

        function labelTextFor(element) {
          if (!element) return '';

          var ariaLabel = element.getAttribute && element.getAttribute('aria-label');
          if (ariaLabel) return ariaLabel.trim();

          var labelledBy = element.getAttribute && element.getAttribute('aria-labelledby');
          if (labelledBy) {
            var text = labelledBy
              .split(/\s+/)
              .map((id) => document.getElementById(id))
              .filter(Boolean)
              .map((node) => node.textContent || '')
              .join(' ')
              .trim();
            if (text) return text;
          }

          if ('labels' in element && element.labels && element.labels.length) {
            var labels = Array.from(element.labels)
              .map((label) => label.textContent || '')
              .join(' ')
              .trim();
            if (labels) return labels;
          }

          var alt = element.getAttribute && element.getAttribute('alt');
          if (alt) return alt.trim();

          var title = element.getAttribute && element.getAttribute('title');
          if (title) return title.trim();

          return (element.textContent || '').replace(/\s+/g, ' ').trim();
        }

        return Object.entries(window.__TL__.getRoles(root)).map(([role, elements]) => ({
          role,
          names: (elements || []).map((element) => labelTextFor(element)),
        }));
      })()`)
    : [];

  const sections: string[] = [];

  if (description) {
    sections.push(description);
  }

  if (!result.found) {
    sections.push("<no element matched>");
  } else if (result.dom) {
    sections.push(result.dom);
  }

  if (options.roles) {
    const roleText = roles.length
      ? roles
          .sort((left, right) => left.role.localeCompare(right.role))
          .flatMap(({ role, names }) => [
            `${role}:`,
            ...names.map((name) => `  Name "${name}"`),
          ])
          .join("\n")
      : "- none";

    sections.push(`Available roles:\n${roleText}`);
  }

  const output = sections.join("\n\n");

  if (options.log !== false) {
    console.log(output);
  }

  return output;
}
