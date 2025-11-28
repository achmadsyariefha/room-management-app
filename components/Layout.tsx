import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return ( 
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)]">
        <Header />
        <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 md:ml-64">{children}</main>
        </div>
    </div>);
}