export function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1" htmlFor={label}>{label}</label>
            {children}
        </div>
    );
}