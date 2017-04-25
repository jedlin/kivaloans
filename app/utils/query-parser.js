module.exports = {

  /**
   * Convert Kiva Specific Query Parameters to JSON Object
   */
  parseQueryParams: (rawQueryString) => {
    // Sample Urls
    // ?country=sv&isGroup=false&tag=10&riskRating=0,5&sector=1,12&status=fundRaising&attribute=6&sortBy=popularity
    // https://api.kivaws.org/v2/loans
    // ?limit=24&facets=true&type=lite&sortBy=popularity&q=j%3A%7B%22riskRating%22%3A%5B0%2C5%5D%2C%22sector%22%3A%5B1%5D%2C%22status%22%3A%22fundRaising%22%7D
    // ?limit=3&facets=true&type=lite&sortBy=amountLeft&q=j%3A{%22sector%22%3A[3]%2C%22status%22%3A%22fundRaising%22}

    // return a promise
    return new Promise((resolve, reject) => {
      try {
        console.log(rawQueryString);
        if (typeof rawQueryString === undefined || rawQueryString ===  '') {
          resolve('');
        }

        // Remove that ? if it preceeds the query params
        const trimmedQuery = (rawQueryString.indexOf('?') === 0) ? rawQueryString.substring(1) : rawQueryString;
        // convert the query params to a usable object
        // adapted from http://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object#8649003
        // wrap the string in brackets and quotes while replacing the & and = separators
        const wrappedQuery = '{"' + trimmedQuery.replace(/&/g, '","').replace(/=/g,'":"') + '"}';
        // generate object using JSON.parse and it's reviver function to decode uri
        let queryObject = JSON.parse(wrappedQuery, (key, value) => { return key === "" ? value : decodeURIComponent(value) });
        
        // Resolve the Promise with a final object
        resolve(queryObject);
      }
      catch (error) {
        console.log(error);
        reject({error: 'Failed to parse query string.'});
      }
    });
  },

  /**
   * Extract extraneous nodes + ensure proper types match what graphql expects
   */
  transformQueryObject: (queryObject) => {

    return new Promise((resolve, reject) => {
      try {
        if (typeof queryObject === undefined || queryObject ===  '') {
          resolve('');
        }

        // Setup Fresh Object
        let gqlQueryObject = {filters:{}};

        // Graphql parameters for loans
        // offset: Int, limit: Int, filters: LoanSearchFilters {object}, query_string: String, sort_by: LoanSearchSortBy 'String'
        const topLevelKeys = ['offset', 'limit', 'filters', 'query_string', 'sort_by'];

        // Move sortBy to sort_by
        if (queryObject.sortBy) {
          gqlQueryObject.sort_by = queryObject.sortBy;
        }

        // gather remaining top level keys
        for (let key in queryObject) {
          if (topLevelKeys.includes(key)) {
            gqlQueryObject[key] = queryObject[key];
          }
        }

        console.log(gqlQueryObject);

        // Let's Play Operation on the filters Object in order to make it match our loans graphql properties

        // Convert to MinMaxRange {min:float, max:float}
        // -> description for riskRating says that an array [0,5] will work but this fails with a GraphQL Error
        const minMaxRangeKeys = ['arrearsRate', 'avgBorrowerCost', 'defaultRate', 'lenderTerm', 'profitability', 'riskRating'];

        // Convert/Ensure Bool 
        const booleanKeys = ['currencyLossPossible', 'excludeNonRated', 'isGroup', 'dafEligible', 'expiringSoon'];
        
        // Ensure Array of String values
        const arrayOfStringKeys = ['country', 'city_state', 'theme'];
        
        // Ensure Array of Int values
        const arrayOfIntKeys = ['lenderFavorite', 'loanTags', 'matcherAccountId', 'partner', 'sector', 'activity', 'trustee'];
        
        // Ensure String
        const stringKeys = ['distributionModel', 'gender', 'status'];

        // Collect all possible filter keys
        const allFilterKeys = minMaxRangeKeys.concat(booleanKeys, arrayOfStringKeys, arrayOfIntKeys, stringKeys);

        for (let filterKey in queryObject) {

          // Operate on stringKeys Keys
          if (stringKeys.includes(filterKey)) {
            console.log('stringKeys ', filterKey);
            // ensure value is a string
            if (typeof queryObject[filterKey] == 'string') {
              gqlQueryObject.filters[filterKey] = queryObject[filterKey];
            }
          }

          // Operate on MinMaxRange Keys
          if (minMaxRangeKeys.includes(filterKey)) {
            console.log('MinMaxRange ', filterKey);
            // convert [0,5] to {min:float, max:float}
            let minMaxArray = queryObject[filterKey].split(',');
            if (minMaxArray.length === 1) {
              // sometimes it returns with 1 entry ommitting 0 for the range
              gqlQueryObject.filters[filterKey] = {min: '0', max: minMaxArray[0]};
            } else {
              gqlQueryObject.filters[filterKey] = {min: minMaxArray[0], max: minMaxArray[1]};
            }
          }

          // Operate on booleanKeys Keys
          if (booleanKeys.includes(filterKey)) {
            console.log('booleanKeys ', filterKey);
            // ensure value is true or false
            if (queryObject[filterKey] === 'true' || queryObject[filterKey] === 'false') {
              gqlQueryObject.filters[filterKey] = queryObject[filterKey];
            }
          }

          // Operate on arrayOfStringKeys Keys
          // if (arrayOfStringKeys.includes(filterKey)) {
          //   console.log('arrayOfStringKeys ', filterKey);
          //   // ensure value is an array of strings
          //   let stringsArray = queryObject[filterKey].split(',');
          //   for (let s = 0; s < stringsArray.length; s++) {
          //     // TODO: figure out why graphql won't accept this array of strings
          //     // ...look like strings to me + this country: ["ng","zm"] works in the graphicql interface
          //     console.log(typeof stringsArray[s]);
          //   }
          //   gqlQueryObject.filters[filterKey] = stringsArray;
          // }

          // Operate on arrayOfIntKeys Keys
          if (arrayOfIntKeys.includes(filterKey)) {
            console.log('arrayOfIntKeys ', filterKey);
            // ensure value is an array of strings
            let intsArray = queryObject[filterKey].split(',');
            gqlQueryObject.filters[filterKey] = intsArray;
          }
        }

        console.log(gqlQueryObject);
        // Resolve the Promise with a final object
        resolve(gqlQueryObject);
      }
      catch (error) {
        console.log(error);
        reject({error: 'Failed to parse query string.'});
      }
    });
  }
}
