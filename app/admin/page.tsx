import { AdminDashboard } from "@/components/admin-dashboard"
import { AuthProvider } from "@/lib/auth-context"

export const metadata = {
    title: "Admin Dashboard | CampusGrid",
    description: "Global perspective and AI controls for CampusGrid administrators.",
}

export default function AdminPage() {
    return (
        <AuthProvider>
            <AdminDashboard />
        </AuthProvider>
    )
}
