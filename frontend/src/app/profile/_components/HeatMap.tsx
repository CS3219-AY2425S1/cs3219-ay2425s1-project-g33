interface CollaborationHeatmapProps {
  monthsData: Array<Array<number>>;
  year: number;
}

export default function CollaborationHeatmap({
  monthsData,
  year,
}: CollaborationHeatmapProps) {
  return (
    <section className="flex flex-row gap-8 rounded-lg max-w-4xl">
      <div className="grid grid-cols-12 gap-2 mt-4">
        {monthsData.map((month, monthIndex) => (
          <div key={monthIndex} className="flex flex-col items-center">
            <div className="grid grid-cols-3 gap-1">
              {month.map((active, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-4 h-4 ${active ? "bg-primary" : "bg-background-100"}`}
                />
              ))}
            </div>
            <p className="text-sm text-card-foreground-100 pt-4">{getMonthName(monthIndex)}</p>
          </div>
        ))}
      </div>

        <div className="flex flex-col items-center">
          {[2024, 2023, 2022, 2021].map((yr) => (
            <button
              key={yr}
              className={`w-20 py-1 font-bold my-1 rounded-md ${year === yr ? "bg-primary" : "text-card-foreground-100"}`}
            >
              {yr}
            </button>
          ))}
        </div>

    </section>
  );
}

// Convert month index to name
function getMonthName(index: number): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  return months[index];
}
