const YearFilterButtons = ({ beerData, filterDateRange, setFilterDateRange }) => {
  // Extract unique years from beerData
  const uniqueYears = [
    ...new Set(beerData.map((item) => new Date(item.created_at).getFullYear())),
  ];
  const uniqueDates = [
    ...new Set(
      beerData.map((item) => new Date(item.created_at).toISOString().slice(0, 10))
    ),
  ];
  const currDate = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-none lg:grid-flow-col gap-4 my-4">
      <div className="block">
        <button
          key="set-all-time"
          className={`shadow w-full border rounded py-2 px-3 mb-4 ${
            filterDateRange?.start.startsWith(`${uniqueDates[uniqueDates.length-1]}`)
              ? 'bg-white text-gray-900'
              : 'text-white bg-gray-900'
          }`}
          onClick={() =>
            setFilterDateRange({
              start: `${uniqueDates[uniqueDates.length-1]}`,
              end: currDate,
            })
          }
        >
          all
        </button>
      </div>
      {uniqueYears.map((year, i) => (
        <div className="block" key={i}>
          <button
            key={`set-year-${year}`}
            className={`shadow w-full border rounded py-2 px-3 mb-4 ${
              filterDateRange?.start.startsWith(`${year}-01-01`)
                ? 'bg-white text-gray-900'
                : 'text-white bg-gray-900'
            }`}
            onClick={() =>
              setFilterDateRange({
                start: `${year}-01-01`,
                // set today's date in case the selected year is the current one:
                end: currDate < `${year}-12-31` ? currDate : `${year}-12-31`,
              })
            }
          >
            {year}
          </button>
        </div>
      ))}
    </div>
  );
};

export default YearFilterButtons;
