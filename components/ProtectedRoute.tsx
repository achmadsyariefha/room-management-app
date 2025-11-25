import { ReactNode } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useUser();
    const router = useRouter();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        router.push("/login");
        return null;
    }
    return <>{children}</>;
}
