export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      {Icon && (
        <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.04]">
          <Icon size={20} className="text-text-faint" />
        </div>
      )}
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      {description && <p className="max-w-xs text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
