export default function StatsDisplay() {
    const stats = [
        { value: "12,109,471", label: "new predictions" },
        { value: "41,004", label: "new insights" },
        { value: "3,345", label: "new funding rounds" },
    ];

    return (
        <div class="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-16 py-8">
            {stats.map((stat) => (
                <div class="text-center">
                    <p class="text-4xl md:text-5xl font-bold text-primary">{stat.value}</p>
                    <p class="text-sm text-muted-foreground">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}