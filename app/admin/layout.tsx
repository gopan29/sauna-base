export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f0f4f0', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
