import { createContext, useContext } from "react";

export type Provider = "disabled" | "openai" | "azure" | "compatible";

export interface SidebarState {
  provider: Provider;
  apiKey: string;
  model: string;
  endpoint: string;
  apiVersion: string;
  templateFile: string | null;
  enrichment: boolean;
  outputDir: string;
}

export const defaultSidebarState: SidebarState = {
  provider: "disabled",
  apiKey: "",
  model: "gpt-4o",
  endpoint: "",
  apiVersion: "",
  templateFile: null,
  enrichment: false,
  outputDir: "./output",
};

export interface SidebarContextValue {
  state: SidebarState;
  set: (patch: Partial<SidebarState>) => void;
}

export const SidebarContext = createContext<SidebarContextValue>({
  state: defaultSidebarState,
  set: () => {},
});

export const useSidebar = () => useContext(SidebarContext);
