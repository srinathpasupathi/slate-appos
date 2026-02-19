

# Add "AI Providers" Tab Under Org Settings

## Overview
Add a new "AI Providers" section to the Org Settings in the Settings overlay. This tab lets users configure API keys for Anthropic, Gemini, and OpenAI, and manage which models are enabled/disabled per provider.

## User Flow

1. User opens Settings, clicks "AI Providers" under Org Settings
2. Sees provider cards (Anthropic, Gemini, OpenAI) showing connection status
3. Clicking an unconfigured card opens a dialog to enter the API key
4. Once configured, clicking the card shows a detail view with:
   - Masked API key (e.g., `sk-••••••••••abc123`) with option to remove/update
   - List of supported models with enable/disable toggles

## Changes

### 1. New file: `src/components/settings/AIProvidersSettings.tsx`

The main component containing:

- **Provider cards grid**: Three cards for Anthropic, Gemini, and OpenAI, each showing provider name, icon/logo, and a status badge ("Connected" / "Not configured")
- **API Key dialog**: A modal triggered on card click (when unconfigured) with a password input and Save button
- **Provider detail view**: Shown when clicking a configured provider card, displaying:
  - Masked API key with "Update Key" and "Remove" actions
  - Model list with Switch toggles for each model
- **Back navigation**: A back button to return from detail view to the cards grid

Static model data per provider:
- **Anthropic**: Claude Opus 4, Claude Sonnet 4, Claude Sonnet 3.5, Claude Haiku 3.5
- **OpenAI**: GPT-5, GPT-5 Mini, GPT-4o, GPT-4o Mini
- **Gemini**: Gemini 2.5 Pro, Gemini 2.5 Flash, Gemini 2.0 Flash

State is managed locally with `useState` (no backend persistence for now).

### 2. Update: `src/components/SettingsOverlay.tsx`

- Import `AIProvidersSettings`
- Add `{ id: "ai-providers", label: "AI Providers", icon: Brain }` to `orgMenuItems` (using `Brain` icon from lucide-react)
- Add case `"ai-providers"` in `renderContent()` returning `<AIProvidersSettings />`
- Add description in `getDescription()`: "Configure AI provider API keys and manage available models."

## Technical Details

- Follows the same card/section styling patterns used in BillingSettings and PrivacySettings (rounded-xl borders, consistent spacing)
- Uses existing UI components: Switch, Input, Button, Dialog, Badge
- All state is local -- API keys are stored in component state only (UI prototype)
- Masked key display: shows first 3 and last 6 characters

