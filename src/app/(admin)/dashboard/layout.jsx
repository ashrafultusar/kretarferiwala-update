import { auth } from '../../../../auth';
import AdminNav from './AdminNav';
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <AdminNav>{children}</AdminNav>;
}
