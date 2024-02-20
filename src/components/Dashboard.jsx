import { useState, useEffect } from 'react';
import Map from './Map.jsx';
import BreweryMap from './BreweryMap.jsx';
import TopTableList from './TopTableList/TopTableList.jsx';
import Overview from './Overview/Overview.jsx';
import OverviewFilters from './Overview/OverviewFilters.jsx';
import PieChartList from './Charts/PieChartList.jsx';
import BarChartList from './Charts/BarChartList.jsx';
import DateSelector from './DateSelector/DateSelector.jsx';
import YearFilterButtons from './YearFilterButtons.jsx';
import ResetFilters from './ResetFilters.jsx';
import {
  filterBeerData,
  getDefaultStartDate,
  getDefaultEndDate,
  fetchData,
  filterDuplicateBeers,
  isFilterOverviewSet,
} from '../utils/';

const Dashboard = () => {
  const [beerData, setBeerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterOverview, setFilterOverview] = useState({
    brewery_name: '',
    venue_country: '',
    venue_city: '',
  });
  const [filterDateRange, setFilterDateRange] = useState({
    start: getDefaultStartDate(),
    end: getDefaultEndDate(),
  });

  useEffect(() => {
    // Fetch the JSON file or import it directly
    let user = process.env.REACT_APP_NAME;

    const fetchDataAndSetState = async () => { 
      fetchData('/beers-processed_' + user + '.json')
        .then(data => {
          data = data.map((item) => ({
            beer_name: item.beer.beer_name, 
            brewery_name: item.brewery.brewery_name,
            beer_type: item?.beer?.beer_style, 
            beer_abv: item?.beer?.beer_abv, 
            beer_ibu: '0', 
            comment: '', 
            venue_name: item?.venue?.venue_name, 
            venue_city: item?.venue?.location?.venue_city, 
            venue_state: item?.venue?.location?.venue_state, 
            venue_country: item?.venue?.location?.venue_country,
            venue_lat: item?.venue?.location?.lat, 
            venue_lng: item?.venue?.location?.lng, 
            rating_score: item?.rating_score, 
            created_at: item?.created_at, 
            checkin_url: 'https://untappd.com/c/'+ item.checkin_id,
            beer_url: 'https://untappd.com/beer/' + item.beer.bid, 
            brewery_url: 'https://untappd.com/brewery/' + item.brewery.brewery_id,
            brewery_country: item?.brewery?.country_name, 
            brewery_city: item?.brewery?.location?.brewery_city,
            brewery_state: item?.brewery?.location?.brewery_state, 
            brewery_lat: item?.brewery?.location?.lat,
            brewery_lng: item?.brewery?.location?.lng,
            flavor_profiles: null, 
            purchase_venue: 'None', 
            serving_type: 'Tap', 
            checkin_id: item.checkin_id, 
            bid: item.beer.bid, 
            brewery_id: item.brewery.brewery_id, 
            photo_url: item.media?.items[0]?.photo?.photo_img_md, 
            global_rating_score: 0, 
            global_weighted_rating_score: 0, 
            tagged_friends: 'Test', 
            total_toasts: item?.toasts?.total_count,
            total_comments: item?.comments?.total_count 
          }));
          if (data) {
            //remove empty items from data
            let filteredData = data.filter(item => item || item === 0);
            setBeerData(filteredData);
            setFilteredData(); // Initial load without filters
          }
        }).catch(error => {
            console.error('Error:', error);
        });
    };

    fetchDataAndSetState();
  }, []);

  useEffect(() => {
    // this is ran each time a filter changes
    const filteredResults = filterBeerData(beerData, filterOverview, filterDateRange);
    // console.log('debug:', filterOverview);
    setFilteredData(filteredResults);
  }, [beerData, filterOverview, filterDateRange]);

  const totalBeerCount = filteredData && filteredData?.length;
  const totalUniqueBeerCount = filteredData && filterDuplicateBeers(filteredData)?.length;
  const totalDiff = totalBeerCount - totalUniqueBeerCount;

  return (
    <>
      <DateSelector
        beerData={beerData}
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
      />
      {filteredData && totalBeerCount > 0 ? (
        <>
          <div className="rounded shadow-md">
            <YearFilterButtons
              beerData={beerData}
              filterDateRange={filterDateRange}
              setFilterDateRange={setFilterDateRange}
            />
            <OverviewFilters
              beerData={filteredData}
              filterOverview={filterOverview}
              setFilterOverview={setFilterOverview}
            />
            <div className="flex items-center mt-10 mb-6">
              <h2 className="text-2xl font-bold">
                {totalBeerCount} beers <span className="text-gray-600">/</span>{' '}
                {totalUniqueBeerCount} uniques{' '}
                <span className="text-gray-600">(+{totalDiff})</span>
              </h2>
              {isFilterOverviewSet(filterOverview) && (
                <ResetFilters setFilterOverview={setFilterOverview} />
              )}
            </div>
            <div className="container mx-auto mt-4 p-8 bg-gray-800 rounded shadow-md">
              <div className="grid lg:grid-cols-2 gap-8 text-white">
                <PieChartList beerData={filteredData} />
                <div className="grid grid-cols-subgrid gap-8">
                  <BarChartList beerData={filteredData} />
                  <TopTableList beerData={filteredData} />
                </div>
                <Map beerData={filteredData} />
                <BreweryMap beerData={filteredData} />
              </div>
            </div>
          </div>
          <Overview beerData={filteredData} />
        </>
      ) : (
        <div className="mt-4">
          Loading results or your filters didn't return a result.
        </div>
      )}
    </>
  );
};

export default Dashboard;
