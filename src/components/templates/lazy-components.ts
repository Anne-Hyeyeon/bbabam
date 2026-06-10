"use client";

import { lazy, type ComponentType } from "react";
import { templates, type TemplateInteractionProps } from "./index";

// lazy() wrappers are created once at module scope so render stays pure
// (react-hooks/static-components). Chunks still load on first render.
export const lazyTemplateComponents: Record<
  string,
  ComponentType<TemplateInteractionProps>
> = Object.fromEntries(templates.map((t) => [t.id, lazy(t.component)]));
