import React, { useState, useEffect } from 'react';
import LeafletMap from './LeafletMap';
import { formatDate } from './utils';

const BeerList = () => {

  const getDefaultStartDate = () => {
    const currentDate = new Date();
    const last30Days = new Date(currentDate);
    last30Days.setDate(currentDate.getDate() - 30);
    return last30Days.toISOString().split('T')[0];
  };

  const getDefaultEndDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [beerData, setBeerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterBrewery, setFilterBrewery] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({
    start: getDefaultStartDate(),
    end: getDefaultEndDate(),
  });

  useEffect(() => {
    // Fetch the JSON file or import it directly
    const fetchData = async () => {
      try {
        const response = await fetch('/beers.json');
        const data = await response.json();
        setBeerData(data);
        setFilteredData(); // Initial load without filters
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters whenever filterBrewery or filterDateRange changes
    const filteredResults = beerData.filter((item) => {
      const breweryMatch = filterBrewery
        ? item.brewery_name.toLowerCase().includes(filterBrewery.toLowerCase())
        : true;

      const dateMatch =
        (filterDateRange.start && filterDateRange.end) &&
        (new Date(item.created_at) >= new Date(filterDateRange.start) &&
          new Date(item.created_at) <= new Date(filterDateRange.end));

      return breweryMatch && dateMatch;
    });

    setFilteredData(filteredResults);
  }, [beerData, filterBrewery, filterDateRange]);

  return (
    <div className="container mx-auto mt-8 p-8 bg-gray-100 rounded shadow-md">
      <h1 className="mb-5 text-4xl font-bold">Untappd 10 Years App</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Brewery:</label>
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={filterBrewery}
          onChange={(e) => setFilterBrewery(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Created Between:</label>
        <div className="flex">
          <input
            type="date"
            className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterDateRange.start}
            onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
          />
          <input
            type="date"
            className="ml-2 shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterDateRange.end}
            onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
          />
        </div>
      </div>  
      {filteredData?.length > 0 && (
        <div className="overflow-hidden rounded shadow-md my-4">
          <LeafletMap beerData={filteredData} />
        </div>
      )}    
      <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredData?.length > 0 && filteredData.map((item) => (
          <li key={item.checkin_id} className="bg-white rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{item.beer_name}</h2>
            {/* <img src={item.photo_url} alt="" /> */}
            <p className="text-gray-700 mb-2">{item.brewery_name}</p>
            <p className="text-gray-600">Created at: {formatDate(item.created_at)}</p>
            <p className="text-green-600">Rating: {item.rating_score}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BeerList;