import { ReactNode, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return ( 
        <div className="flex flex-col min-h-screen bg-bg">
            <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}/>
            <div className="flex flex-1">
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}/>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}