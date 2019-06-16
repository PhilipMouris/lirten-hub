//Global search function expecting a Key String ,an array of objects
// & values that will be disregarded by the search
const search = (arr, searchKey, excludedValues) => {
  if (searchKey.length === 0) return arr;
  const keys = searchKey.split(" ");
  const filteredArray = [];
  //searching all objects for all keys,manual filter to avoid filtering after
  //setting matchCounts
  arr.forEach(obj => {
    Object.keys(obj.userData).forEach(key => {
      obj[key] = obj.userData[key];
    });
    Object.keys(obj).forEach(prop => {
      if (excludedValues.includes(prop) || prop === "userData") return;
      const value = obj[prop];
      keys.forEach(key => {
        if (("" + value).toUpperCase().includes(("" + key).toUpperCase())) {
          if (obj.matchCount) obj.matchCount++;
          else obj.matchCount = 1;
        }
      });
      //checking if any value matched
    });
    if (obj.matchCount) filteredArray.push(obj);
  });
  //sorting then removing the matchCount property
  return filteredArray
    .sort((a, b) => b.matchCount - a.matchCount)
    .map(obj => {
      delete obj.matchCount;
      return obj;
    });
};

export default search;
