export const PRODUCTS = [
  {
    id: "academy-pro",
    name: "Synckaiden Academy Pro",
    price: "$29/mo or $199/yr",
    description: "Unlock Pro Vault: advanced prompts, go-to-market scripts, and weekly 'ahead-of-the-curve' intel routines.",
    paymentLink: import.meta.env.VITE_STRIPE_PAYMENT_LINK || "#",
    deliverable: "Pro Access Key (manual issue)",
  },
  {
    id: "contract-audit",
    name: "Blacklight Contract Audit",
    price: "$299+",
    description: "Upload any contract → clause risk flags + negotiation script + redline suggestions (not legal advice).",
    paymentLink: import.meta.env.VITE_STRIPE_CONTRACT_AUDIT_LINK || "#",
    deliverable: "PDF risk memo + negotiation script",
  },
  {
    id: "cost-cut-pack",
    name: "Cost-Cut Autopilot Templates",
    price: "$49",
    description: "Ready-to-run workflow blueprints: invoice parsing, subscription cleanup, renegotiation scripts, KPI tracking.",
    paymentLink: import.meta.env.VITE_STRIPE_TEMPLATE_PACK_LINK || "#",
    deliverable: "Template pack (download)",
  },
];
