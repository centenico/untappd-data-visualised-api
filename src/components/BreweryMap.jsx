import { useEffect, useRef } from 'react';
import Leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from '../images/pin.svg';
import { formatDate } from '../utils/';
import Icon from './Icon/Icon.jsx';

export const newIcon = new Leaflet.Icon({
  iconUrl,
  iconAnchor: [5, 55],
  popupAnchor: [10, -44],
  iconSize: [25, 55],
});

const Map = ({ beerData }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const fitMapBounds = () => {
      if (mapRef.current && beerData.length > 1) {
        const bounds = new Leaflet.LatLngBounds();
        beerData.forEach((item) => {
          if (item.brewery_lat && item.brewery_lng) {
            bounds.extend([parseFloat(item.brewery_lat), parseFloat(item.brewery_lng)]);
          }
        });

        // Ensure the map has a valid size before attempting to fit bounds
        if (bounds.isValid() && mapRef.current) {
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    };
    // Apply a small delay on initial render or else bounds are incorrect
    const timeoutId = setTimeout(fitMapBounds, 200);
    return () => clearTimeout(timeoutId);
  }, [beerData, mapRef]);

  return (
    <div className="p-2">
      <h3 className="text-xl font-bold">Brewery Map</h3>
      <div className="overflow-hidden border border-gray-900 rounded shadow-md my-4">
        <MapContainer
          ref={mapRef}
          style={{ height: '500px', width: '100%' }}
          center={[0, 0]}
          zoom={2}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />
          {beerData.map(
            (item) =>
              item.brewery_lat &&
              item.brewery_lng && (
                <Marker
                  key={item.checkin_id}
                  position={[parseFloat(item.brewery_lat), parseFloat(item.brewery_lng)]}
                  icon={newIcon}
                >
                  <Popup>
                    <strong>
                      <a href={item.checkin_url} target="_blank" rel="noopener">
                        {item.beer_name}
                      </a>
                    </strong>
                    <br />
                    {item.brewery_name}
                    <div className="flex mt-2 items-center mb-1">
                      <Icon
                        icon="LOCATION"
                        viewBox="0 0 70.749 90"
                        className="mr-1 fill-gray-800"
                      />
                      {item.brewery_city && `, ${item.brewery_city}`}
                    </div>
                    <div className="flex items-center mb-1">
                      <Icon
                        icon="STAR"
                        viewBox="0 0 512 512"
                        className="mr-1 fill-gray-800"
                      />
                      {item.rating_score}
                    </div>
                    <div className="flex items-center mb-1">
                      <Icon
                        icon="CALENDAR"
                        viewBox="0 0 488 512"
                        className="mr-1 fill-gray-800"
                      />
                      {formatDate(item.created_at)}
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
