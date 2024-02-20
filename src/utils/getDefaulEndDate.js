// Function to get the default end date
export const getDefaultEndDate = () => {
  let date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};
