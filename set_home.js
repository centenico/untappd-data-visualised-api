const fs = require('fs');

// the config file
const config = require('./public/home-config.json');
const newValues = config.home;

// Load your original JSON file
const originalData = require('./public/beers_nicola.json');

// Create a Set to keep track of unique checkin_ids
const uniqueCheckinIds = new Set();

// Update the values in the original data based on the condition
const updatedData = originalData.map((item) => {
  if (
    item.venue_name === 'Untappd at Home' ||
    item.venue_name === 'Untappd Virtual Festival' ||
    item.venue_name === 'Untappd 10th Anniversary Party'
  ) {
    return {
      ...item,
      ...newValues,
    };
  }
  return item;
});

// Filter out duplicates based on the 'checkin_id'
const filteredData = updatedData.filter((item) => {
  if (!uniqueCheckinIds.has(item.checkin_id)) {
    uniqueCheckinIds.add(item.checkin_id);
    return true;
  }
  return false;
});

// Save the updated and filtered data to a new JSON file
const outputFile = './public/beers-processed_nicola.json';
fs.writeFileSync(outputFile, JSON.stringify(filteredData, null, 2));
console.log('Values updated and duplicates removed. Updated data saved to', outputFile);
