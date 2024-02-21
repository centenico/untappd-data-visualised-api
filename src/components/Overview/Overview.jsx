import { useState } from 'react';
import OverviewCardPropery from '../Overview/OverviewCardPropery.jsx';

const Overview = ({ beerData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const handleNextPage = () => {
    if (currentPage < Math.ceil(beerData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedData = beerData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mt-8">
        {paginatedData?.length > 0 &&
          paginatedData.map((item) => (
            <div
              key={item.checkin_id}
              style={{
                backgroundImage: `url(${item.photo_url})`,
              }}
              className="block shadow-md bg-cover transition-transform duration-300 transform hover:scale-110 rounded-lg overflow-hidden"
            >
              <a
                href={item.checkin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 block bg-gray-800 min-h-80 rounded-lg bg-opacity-50"
              >
                <h2 className="text-xl text-white font-semibold mb-2">
                  {item.beer_name}
                </h2>
                <p className="mb-4">{item.brewery_name}</p>
                <OverviewCardPropery
                  icon="BEER"
                  viewBox="0 0 473.639 512"
                  value={item.beer_type}
                />
                <OverviewCardPropery
                  icon="CALENDAR"
                  viewBox="0 0 488 512"
                  value={item.created_at}
                  formatOutput
                />
                {item.venue_name && (
                  <OverviewCardPropery
                    icon="LOCATION"
                    viewBox="0 0 70.749 90"
                    value={item.venue_name}
                  />
                )}
                <OverviewCardPropery
                  icon="STAR"
                  viewBox="0 0 512 512"
                  value={item.rating_score}
                />
              </a>
            </div>
          ))}
      </div>
      {beerData?.length > itemsPerPage && (
        <div className="mt-6 mb-2 flex justify-center">
          {currentPage > 1 && (
            <button
              className="bg-yellow-600 hover:bg-yellow-700 transition-colors duration-300 text-white font-bold py-3 px-5 rounded mr-2"
              onClick={handlePrevPage}
            >
              Previous Page
            </button>
          )}
          {currentPage < Math.ceil(beerData.length / itemsPerPage) && (
            <button
              className="bg-yellow-600 hover:bg-yellow-700 transition-colors duration-300 text-white font-bold py-3 px-5 rounded mr-2"
              onClick={handleNextPage}
            >
              Next Page
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Overview;
