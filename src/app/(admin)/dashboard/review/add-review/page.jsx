
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReviewForm from "@/components/admin/ReviewForm/ReviewForm";

export default function Page() {
  return (
    <div className="p-6">
      <Link 
        href="/dashboard/review" 
        className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 transition"
      >
        <ArrowLeft size={18} /> Back to List
      </Link>
      
      <ReviewForm />
    </div>
  );
}