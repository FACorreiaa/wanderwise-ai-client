import { createSignal, For, Show } from "solid-js";
import { Plus, Copy, Check, Trash2, KeyRound, X, Terminal } from "lucide-solid";
import { Button } from "~/ui/button";
import { TextField, TextFieldRoot } from "~/ui/textfield";
import { Label } from "~/ui/label";
import {
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  type CreatedApiKey,
} from "~/lib/api/api-keys";

interface ApiKeysProps {
  onNotification: (message: string, type: "success" | "error") => void;
}

const MCP_ENDPOINT = `${import.meta.env.VITE_CONNECT_BASE_URL ?? "http://localhost:8000"}/mcp`;

function formatDate(ms?: number): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApiKeys(props: ApiKeysProps) {
  const keysQuery = useApiKeys();
  const createMutation = useCreateApiKey();
  const revokeMutation = useRevokeApiKey();

  const [newName, setNewName] = createSignal("");
  const [created, setCreated] = createSignal<CreatedApiKey | null>(null);
  const [copied, setCopied] = createSignal(false);
  const [revokingId, setRevokingId] = createSignal<string | null>(null);

  const handleCreate = async (e: Event) => {
    e.preventDefault();
    const name = newName().trim();
    if (!name) {
      props.onNotification("Give the key a name so you can recognize it later.", "error");
      return;
    }
    try {
      const result = await createMutation.mutateAsync(name);
      setCreated(result);
      setNewName("");
    } catch (err) {
      props.onNotification(
        err instanceof Error ? err.message : "Failed to create API key.",
        "error",
      );
    }
  };

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await revokeMutation.mutateAsync(id);
      props.onNotification("API key revoked.", "success");
    } catch (err) {
      props.onNotification(
        err instanceof Error ? err.message : "Failed to revoke API key.",
        "error",
      );
    } finally {
      setRevokingId(null);
    }
  };

  const copyPlaintext = async () => {
    const key = created()?.plaintext;
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      props.onNotification("Couldn't copy — select and copy the key manually.", "error");
    }
  };

  const activeKeys = () => (keysQuery.data ?? []).filter((k) => !k.revokedAt);

  return (
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-semibold text-foreground flex items-center gap-2">
          <KeyRound class="w-5 h-5 text-primary" />
          API Keys
        </h2>
        <p class="text-sm text-muted-foreground mt-1">
          Connect Claude, Codex, Gemini, and other AI agents to Loci over MCP. Each key
          authenticates as you and counts against your daily plan.
        </p>
      </div>

      {/* MCP connection hint */}
      <div class="rounded-lg border border-border bg-muted/40 p-4">
        <div class="flex items-center gap-2 text-sm font-medium text-foreground">
          <Terminal class="w-4 h-4" />
          Your MCP endpoint
        </div>
        <code class="mt-2 block text-xs sm:text-sm text-muted-foreground break-all">
          {MCP_ENDPOINT}
        </code>
        <p class="text-xs text-muted-foreground mt-2">
          Add this URL to your AI client with the header{" "}
          <code class="text-foreground">Authorization: Bearer &lt;your-key&gt;</code>. See the{" "}
          <a href="/mcp" class="text-primary underline underline-offset-2">
            setup guide
          </a>
          .
        </p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} class="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div class="flex-1">
          <Label for="new-key-name" class="text-sm">
            New key name
          </Label>
          <TextFieldRoot class="mt-1">
            <TextField
              id="new-key-name"
              placeholder="e.g. Claude Desktop"
              value={newName()}
              onInput={(e) => setNewName(e.currentTarget.value)}
              maxLength={100}
            />
          </TextFieldRoot>
        </div>
        <Button type="submit" disabled={createMutation.isPending} class="gap-2">
          <Plus class="w-4 h-4" />
          {createMutation.isPending ? "Creating…" : "Create key"}
        </Button>
      </form>

      {/* Keys list */}
      <div class="space-y-2">
        <Show
          when={!keysQuery.isLoading}
          fallback={<p class="text-sm text-muted-foreground">Loading keys…</p>}
        >
          <Show when={keysQuery.isError}>
            <div class="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <span class="text-sm text-destructive">Couldn't load your keys.</span>
              <Button variant="outline" size="sm" onClick={() => keysQuery.refetch()}>
                Retry
              </Button>
            </div>
          </Show>

          <Show
            when={activeKeys().length > 0}
            fallback={
              <Show when={!keysQuery.isError}>
                <p class="text-sm text-muted-foreground py-4 text-center">
                  No API keys yet. Create one above to connect an AI agent.
                </p>
              </Show>
            }
          >
            <div class="divide-y divide-border rounded-lg border border-border">
              <For each={activeKeys()}>
                {(key) => (
                  <div class="flex items-center justify-between gap-4 p-3">
                    <div class="min-w-0">
                      <div class="font-medium text-foreground truncate">{key.name}</div>
                      <div class="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        <span class="font-mono">{key.keyPrefix}…</span>
                        <span>Created {formatDate(key.createdAt)}</span>
                        <span>
                          Last used {key.lastUsedAt ? formatDate(key.lastUsedAt) : "never"}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-destructive hover:text-destructive gap-1 shrink-0"
                      disabled={revokingId() === key.id}
                      onClick={() => handleRevoke(key.id)}
                    >
                      <Trash2 class="w-4 h-4" />
                      {revokingId() === key.id ? "Revoking…" : "Revoke"}
                    </Button>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </div>

      {/* Show-once secret overlay */}
      <Show when={created()}>
        {(result) => (
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div class="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-foreground">Copy your API key now</h3>
                  <p class="text-sm text-muted-foreground mt-1">
                    This is the only time it will be shown. Store it somewhere safe.
                  </p>
                </div>
                <button
                  onClick={() => setCreated(null)}
                  class="text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <div class="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
                <code class="flex-1 text-xs sm:text-sm text-foreground break-all font-mono">
                  {result().plaintext}
                </code>
                <Button variant="outline" size="sm" class="gap-1 shrink-0" onClick={copyPlaintext}>
                  <Show when={copied()} fallback={<Copy class="w-4 h-4" />}>
                    <Check class="w-4 h-4 text-accent" />
                  </Show>
                  {copied() ? "Copied" : "Copy"}
                </Button>
              </div>

              <div class="mt-6 flex justify-end">
                <Button onClick={() => setCreated(null)}>Done</Button>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}
