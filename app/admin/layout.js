export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {/* Admin-specific navigation or components */}
      <nav>Admin Navigation</nav>
      <main>{children}</main>
    </div>
  );
}
