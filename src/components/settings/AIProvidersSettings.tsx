import { useState } from "react";
import { ArrowLeft, Key, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ProviderId = "anthropic" | "openai" | "gemini";

interface ProviderConfig {
  id: ProviderId;
  name: string;
  models: { id: string; name: string }[];
}

const providers: ProviderConfig[] = [
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "claude-opus-4", name: "Claude Opus 4" },
      { id: "claude-sonnet-4", name: "Claude Sonnet 4" },
      { id: "claude-sonnet-3.5", name: "Claude Sonnet 3.5" },
      { id: "claude-haiku-3.5", name: "Claude Haiku 3.5" },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-mini", name: "GPT-5 Mini" },
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    models: [
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
    ],
  },
];

function maskKey(key: string): string {
  if (key.length <= 9) return "••••••••••";
  return key.slice(0, 3) + "••••••••••" + key.slice(-6);
}

const AIProvidersSettings = () => {
  const [keys, setKeys] = useState<Record<ProviderId, string | null>>({
    anthropic: null,
    openai: null,
    gemini: null,
  });
  const [enabledModels, setEnabledModels] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    providers.forEach((p) => p.models.forEach((m) => (initial[m.id] = true)));
    return initial;
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProvider, setDialogProvider] = useState<ProviderId | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [detailProvider, setDetailProvider] = useState<ProviderId | null>(null);

  const [defaultProvider, setDefaultProvider] = useState<ProviderId | "">("");
  const [defaultModel, setDefaultModel] = useState<string>("");

  const handleCardClick = (id: ProviderId) => {
    if (keys[id]) {
      setDetailProvider(id);
    } else {
      setDialogProvider(id);
      setKeyInput("");
      setDialogOpen(true);
    }
  };

  const handleSaveKey = () => {
    if (dialogProvider && keyInput.trim()) {
      setKeys((prev) => ({ ...prev, [dialogProvider]: keyInput.trim() }));
      setDialogOpen(false);
      setKeyInput("");
      setDialogProvider(null);
    }
  };

  const handleRemoveKey = (id: ProviderId) => {
    setKeys((prev) => ({ ...prev, [id]: null }));
    setDetailProvider(null);
  };

  const handleUpdateKey = (id: ProviderId) => {
    setDialogProvider(id);
    setKeyInput("");
    setDialogOpen(true);
  };

  const toggleModel = (modelId: string) => {
    setEnabledModels((prev) => ({ ...prev, [modelId]: !prev[modelId] }));
  };

  // Detail view for a configured provider
  if (detailProvider) {
    const provider = providers.find((p) => p.id === detailProvider)!;
    return (
      <div className="space-y-6">
        <button
          onClick={() => setDetailProvider(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to providers
        </button>

        <div className="rounded-xl border border-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-foreground">{provider.name}</h4>
              <p className="text-sm text-muted-foreground mt-0.5 font-mono">
                {maskKey(keys[detailProvider]!)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleUpdateKey(detailProvider)}>
                <Key className="h-3.5 w-3.5 mr-1.5" />
                Update Key
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleRemoveKey(detailProvider)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-foreground">Models</h4>
          <p className="text-xs text-muted-foreground">Enable or disable individual models for this provider.</p>
        </div>

        <div className="rounded-xl border border-border divide-y divide-border">
          {provider.models.map((model) => (
            <div key={model.id} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-foreground">{model.name}</span>
              <Switch
                checked={enabledModels[model.id]}
                onCheckedChange={() => toggleModel(model.id)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get configured providers and their enabled models for defaults
  const configuredProviders = providers.filter((p) => !!keys[p.id]);
  const availableModels = defaultProvider
    ? providers
        .find((p) => p.id === defaultProvider)
        ?.models.filter((m) => enabledModels[m.id]) || []
    : [];

  // Cards grid view
  return (
    <>
      {/* Default Provider & Model */}
      <div className="rounded-xl border border-border p-5 space-y-4 mb-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Default Provider & Model</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose the default AI provider and model used across your app.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Default Provider</label>
            <Select
              value={defaultProvider}
              onValueChange={(val) => {
                setDefaultProvider(val as ProviderId);
                setDefaultModel("");
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={configuredProviders.length ? "Select provider" : "No providers configured"} />
              </SelectTrigger>
              <SelectContent>
                {configuredProviders.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Default Model</label>
            <Select
              value={defaultModel}
              onValueChange={setDefaultModel}
              disabled={!defaultProvider}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={defaultProvider ? "Select model" : "Choose a provider first"} />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {providers.map((provider) => {
          const configured = !!keys[provider.id];
          return (
            <button
              key={provider.id}
              onClick={() => handleCardClick(provider.id)}
              className="rounded-xl border border-border bg-card p-5 text-left hover:bg-muted/40 transition-colors space-y-3"
            >
              <h4 className="text-sm font-semibold text-foreground">{provider.name}</h4>
              <Badge variant={configured ? "default" : "secondary"} className="text-xs">
                {configured ? "Connected" : "Not configured"}
              </Badge>
            </button>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Add {providers.find((p) => p.id === dialogProvider)?.name} API Key
            </DialogTitle>
            <DialogDescription>
              Enter your API key to connect this provider. The key is stored locally in this session only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              type="password"
              placeholder="sk-..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveKey()}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveKey} disabled={!keyInput.trim()}>
                Save Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIProvidersSettings;
