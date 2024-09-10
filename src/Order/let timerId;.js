let timerId;

const handleSearchChange = (e) => {
  console.log(e.target.value);
  setSearchUserName(e.target.value);
  
  // Clear previous timeout if exists
  clearTimeout(timerId);
  
  // Set a new timeout to trigger searchOrders after 3 seconds
  timerId = setTimeout(() => {
    searchOrders();
  }, 3000); // 3000 milliseconds = 3 seconds
};
