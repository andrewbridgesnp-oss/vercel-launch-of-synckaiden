import { Badge } from "../ui/badge";

type StatusType = "active" | "pending" | "trial" | "vip" | "compliance" | "paid" | "failed" | "expired";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<StatusType, { label: string; className: string }> = {
    active: { label: "Active", className: "bg-green-500/10 text-green-500 border-green-500/20" },
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    trial: { label: "Trial", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    vip: { label: "VIP", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    compliance: { label: "Compliance Mode", className: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" },
    paid: { label: "Paid", className: "bg-green-500/10 text-green-500 border-green-500/20" },
    failed: { label: "Failed", className: "bg-red-500/10 text-red-500 border-red-500/20" },
    expired: { label: "Expired", className: "bg-gray-500/10 text-gray-500 border-gray-500/20" }
  };

  const variant = variants[status];

  return (
    <Badge variant="outline" className={`${variant.className} ${className || ""}`}>
      {variant.label}
    </Badge>
  );
}
