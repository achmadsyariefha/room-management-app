import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.push("/");
        } catch (error: any) {
            console.error("login error: ", error.message);
            setError(error.message);
        }
    };

    const handleRegister = async () => {
        setError(null);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) {
                throw error;
            } else {
                alert("Check your email for the confirmation link!");
            }
        } catch (error: any) {
            console.error("register error: ", error.message);
            setError(error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
                <h1 className="text-center text-2xl font-bold text-gray-800 mb-6">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"/>
                    <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"/>
                    <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
                </form>
                <button onClick={handleRegister} className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 rounded">Register</button>
                {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
            </div>
        </div>
    );
}