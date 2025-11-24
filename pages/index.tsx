import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/router";

export default function Dashboard() {
    const { user, loading } = useUser();
    const router = useRouter();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        router.push("/login");
        return null;
    }
    return (
        <main>
            <h1>Dashboard</h1>
            <p>Hello, {user?.email}</p>
        </main>
    );
}