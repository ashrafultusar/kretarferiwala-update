import ClientLayout from "@/components/ClientLayout";


export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <ClientLayout>
        {children}
      </ClientLayout>
    </div>
  );
}