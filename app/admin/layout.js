export default function AdminLayout({ children }) {
  return (
    <div>
      <nav>Admin navigation</nav>
      <main>{children}</main>
    </div>
  );
}
