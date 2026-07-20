import { createSignal, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useCreateSearchProfileMutation } from "~/lib/api/profiles";

// A short, focused pre-trip questionnaire that writes a default search profile,
// so the very first chat/discover request is already personalised. Reuses the
// existing profile API — no new backend surface.

type Choice = { value: string; label: string; icon: string; hint?: string };

const BUDGETS: Choice[] = [
  { value: "1", label: "Shoestring", icon: "🎒", hint: "Free & cheap picks" },
  { value: "2", label: "Balanced", icon: "💶", hint: "Mix of value & treats" },
  { value: "3", label: "Comfortable", icon: "✨", hint: "Lean into quality" },
  { value: "4", label: "Luxury", icon: "👑", hint: "Best of everything" },
];

const PACES: Choice[] = [
  { value: "relaxed", label: "Relaxed", icon: "🌿", hint: "A few things, unhurried" },
  { value: "moderate", label: "Moderate", icon: "🚶", hint: "A comfortable rhythm" },
  { value: "packed", label: "Packed", icon: "⚡", hint: "See as much as possible" },
];

const MOBILITY: Choice[] = [
  { value: "walking", label: "On foot", icon: "🚶" },
  { value: "transit", label: "Public transit", icon: "🚇" },
  { value: "car", label: "By car", icon: "🚗" },
  { value: "wheelchair", label: "Step-free / accessible", icon: "♿" },
];

const INTERESTS = [
  "Food & Dining",
  "Art & Culture",
  "History",
  "Nature & Parks",
  "Nightlife",
  "Shopping",
  "Architecture",
  "Photography",
  "Local Culture",
  "Adventure",
  "Relaxation",
  "Family",
];

const STEPS = ["Budget", "Pace", "Getting around", "Interests"] as const;

export default function TripSetup() {
  const navigate = useNavigate();
  const createMut = useCreateSearchProfileMutation();

  const [step, setStep] = createSignal(0);
  const [budget, setBudget] = createSignal("2");
  const [pace, setPace] = createSignal("moderate");
  const [mobility, setMobility] = createSignal("walking");
  const [interests, setInterests] = createSignal<string[]>([]);

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const canNext = () => {
    if (step() === 3) return interests().length > 0;
    return true;
  };

  const finish = () => {
    createMut.mutate(
      {
        profile_name: "My Trip Profile",
        is_default: true,
        budget_level: Number(budget()),
        preferred_pace: pace(),
        preferred_transport: mobility(),
        prefer_accessible_pois: mobility() === "wheelchair",
        interests: interests(),
      },
      { onSuccess: () => navigate("/chat"), onError: () => navigate("/chat") },
    );
  };

  const next = () => (step() < STEPS.length - 1 ? setStep(step() + 1) : finish());
  const back = () => step() > 0 && setStep(step() - 1);

  return (
    <main class="mx-auto flex min-h-[70vh] max-w-lg flex-col px-4 py-10">
      {/* Progress */}
      <div class="mb-8">
        <div class="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>{STEPS[step()]}</span>
          <span>
            {step() + 1} / {STEPS.length}
          </span>
        </div>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step() + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div class="flex-1">
        <Show when={step() === 0}>
          <Question title="What's your budget?" subtitle="We'll tune recommendations to match.">
            <ChoiceGrid choices={BUDGETS} selected={budget()} onSelect={setBudget} />
          </Question>
        </Show>

        <Show when={step() === 1}>
          <Question title="How packed should days be?">
            <ChoiceGrid choices={PACES} selected={pace()} onSelect={setPace} />
          </Question>
        </Show>

        <Show when={step() === 2}>
          <Question title="How will you get around?">
            <ChoiceGrid choices={MOBILITY} selected={mobility()} onSelect={setMobility} />
          </Question>
        </Show>

        <Show when={step() === 3}>
          <Question title="What are you into?" subtitle="Pick a few — you can change these later.">
            <div class="flex flex-wrap gap-2">
              <For each={INTERESTS}>
                {(i) => (
                  <button
                    type="button"
                    onClick={() => toggleInterest(i)}
                    class={`rounded-full border px-3 py-1.5 text-sm transition ${
                      interests().includes(i)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {i}
                  </button>
                )}
              </For>
            </div>
          </Question>
        </Show>
      </div>

      {/* Nav */}
      <div class="mt-8 flex items-center justify-between">
        <button
          class="text-sm text-muted-foreground hover:text-foreground disabled:opacity-0"
          onClick={back}
          disabled={step() === 0}
        >
          ← Back
        </button>
        <button
          class="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
          onClick={next}
          disabled={!canNext() || createMut.isPending}
        >
          {step() === STEPS.length - 1
            ? createMut.isPending
              ? "Saving…"
              : "Start planning"
            : "Next"}
        </button>
      </div>
    </main>
  );
}

function Question(props: { title: string; subtitle?: string; children: any }) {
  return (
    <div>
      <h1 class="text-2xl font-semibold">{props.title}</h1>
      <Show when={props.subtitle}>
        <p class="mt-1 text-sm text-muted-foreground">{props.subtitle}</p>
      </Show>
      <div class="mt-6">{props.children}</div>
    </div>
  );
}

function ChoiceGrid(props: { choices: Choice[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div class="grid grid-cols-2 gap-3">
      <For each={props.choices}>
        {(c) => (
          <button
            type="button"
            onClick={() => props.onSelect(c.value)}
            class={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition ${
              props.selected === c.value
                ? "border-primary ring-2 ring-primary/30"
                : "hover:bg-accent"
            }`}
          >
            <span class="text-2xl">{c.icon}</span>
            <span class="font-medium">{c.label}</span>
            <Show when={c.hint}>
              <span class="text-xs text-muted-foreground">{c.hint}</span>
            </Show>
          </button>
        )}
      </For>
    </div>
  );
}
