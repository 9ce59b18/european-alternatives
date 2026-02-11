import type { USVendorComparison } from '../types';

interface USVendorRecord {
  id: string;
  name: string;
  aliases: string[];
}

const US_VENDOR_RECORDS: USVendorRecord[] = [
  {
    id: 'google',
    name: 'Google',
    aliases: [
      'gmail',
      'google search',
      'google workspace',
      'google maps',
      'google chrome',
      'google drive',
      'google ai',
      'google cloud',
      'google analytics',
      'google gemini',
      'google translate',
      'google imagen',
      'waze',
      'youtube',
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    aliases: [
      'outlook',
      'onedrive',
      'microsoft office',
      'bing',
      'edge',
      'azure',
      'microsoft copilot',
      'github copilot',
      'linkedin',
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    aliases: ['chatgpt', 'openai dall-e', 'dall-e', 'dall e'],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    aliases: ['aws', 'aws ai', 'aws translate', 'twitch'],
  },
  {
    id: 'apple',
    name: 'Apple',
    aliases: ['icloud', 'apple maps', 'safari', 'imessage'],
  },
  {
    id: 'meta',
    name: 'Meta',
    aliases: ['facebook', 'instagram', 'whatsapp'],
  },
  {
    id: 'atlassian',
    name: 'Atlassian',
    aliases: ['jira', 'trello'],
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    aliases: ['slack'],
  },
  {
    id: 'x-corp',
    name: 'X Corp',
    aliases: ['x/twitter', 'twitter', 'x'],
  },
  {
    id: 'yahoo',
    name: 'Yahoo',
    aliases: ['yahoo mail'],
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    aliases: [],
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    aliases: [],
  },
  {
    id: 'discord',
    name: 'Discord',
    aliases: [],
  },
  {
    id: 'vimeo',
    name: 'Vimeo',
    aliases: [],
  },
  {
    id: 'expressvpn',
    name: 'ExpressVPN',
    aliases: [],
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    aliases: [],
  },
  {
    id: 'amplitude',
    name: 'Amplitude',
    aliases: [],
  },
  {
    id: 'asana',
    name: 'Asana',
    aliases: [],
  },
  {
    id: 'monday-com',
    name: 'Monday.com',
    aliases: ['monday'],
  },
  {
    id: 'lastpass',
    name: 'LastPass',
    aliases: [],
  },
  {
    id: '1password',
    name: '1Password',
    aliases: [],
  },
  {
    id: 'dashlane',
    name: 'Dashlane',
    aliases: [],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    aliases: [],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    aliases: ['pay pal'],
  },
  {
    id: 'block',
    name: 'Block',
    aliases: ['square'],
  },
  {
    id: 'shopify',
    name: 'Shopify',
    aliases: [],
  },
  {
    id: 'ebay',
    name: 'eBay',
    aliases: ['ebay'],
  },
];

function normalizeVendorName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function slugifyVendorName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

const US_VENDOR_BY_ALIAS = new Map<string, USVendorRecord>();

for (const record of US_VENDOR_RECORDS) {
  const normalizedNames = [record.name, ...record.aliases].map(normalizeVendorName);
  for (const normalizedName of normalizedNames) {
    if (normalizedName) {
      US_VENDOR_BY_ALIAS.set(normalizedName, record);
    }
  }
}

function toComparison(record: USVendorRecord): USVendorComparison {
  return {
    id: record.id,
    name: record.name,
    trustScoreStatus: 'pending',
  };
}

function toFallbackComparison(name: string): USVendorComparison {
  const normalized = name.trim();
  const fallbackId = slugifyVendorName(normalized) || 'us-vendor';

  return {
    id: `us-${fallbackId}`,
    name: normalized,
    trustScoreStatus: 'pending',
  };
}

export function resolveUSVendorComparison(name: string): USVendorComparison {
  const normalized = normalizeVendorName(name);
  const record = US_VENDOR_BY_ALIAS.get(normalized);

  if (record) {
    return toComparison(record);
  }

  return toFallbackComparison(name);
}

export function buildUSVendorComparisons(names: string[]): USVendorComparison[] {
  const deduped = new Map<string, USVendorComparison>();

  for (const name of names) {
    if (!name.trim()) continue;
    const comparison = resolveUSVendorComparison(name);
    if (!deduped.has(comparison.id)) {
      deduped.set(comparison.id, comparison);
    }
  }

  return Array.from(deduped.values());
}
