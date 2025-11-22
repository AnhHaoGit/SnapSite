export default function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center text-sidebar font-semibold gap-2 px-3 py-1 rounded-md hover:bg-hover-sidebar cursor-pointer">
      {icon}
      <span>{label}</span>
    </div>
  );
}
