module.exports = {

  /**
   * Convert Kiva Specific Query Parameters to JSON Object
   */
  parseQueryParams: (rawQueryString) => {
    // Sample Urls
    // https://api.kivaws.org/v2/loans
    // ?limit=24&facets=true&type=lite&sortBy=popularity&q=j%3A%7B%22riskRating%22%3A%5B0%2C5%5D%2C%22sector%22%3A%5B1%5D%2C%22status%22%3A%22fundRaising%22%7D
    // ?limit=3&facets=true&type=lite&sortBy=amountLeft&q=j%3A{%22sector%22%3A[3]%2C%22status%22%3A%22fundRaising%22}

    // return a promise
    return new Promise((resolve, reject) => {
      try {
        console.log(rawQueryString);

        // Remove that ? if it preceeds the query params
        const trimmedQuery = (rawQueryString.indexOf('?') === 0) ? rawQueryString.substring(1) : rawQueryString;
        // convert the query params to a usable object
        // adapted from http://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object#8649003
        // wrap the string in brackets and quotes while replacing the & and = separators
        const wrappedQuery = '{"' + trimmedQuery.replace(/&/g, '","').replace(/=/g,'":"') + '"}';
        // generate object using JSON.parse and it's reviver function to decode uri
        let queryObject = JSON.parse(wrappedQuery, (key, value) => { return key === "" ? value : decodeURIComponent(value) });
        

        // Create the filters node + parse it's contents
        queryObject.filters = JSON.parse(queryObject.q.substring(2));
        // Move sortBy to sort_by
        if (queryObject.sortBy) {
          queryObject.sort_by = queryObject.sortBy;
          delete queryObject.sortBy;
        }
        
        // Get rid of q, graphql uses filters
        if (queryObject.q) delete queryObject.q;
        
        console.log('in promise', queryObject);
        console.log(JSON.stringify(queryObject));
        
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
        // Graphql parameters for loans
        // offset: Int, limit: Int, filters: LoanSearchFilters {object}, query_string: String, sort_by: LoanSearchSortBy "String"
        const topLevelKeys = ['offset', 'limit', 'filters', 'query_string', 'sort_by'];
        // delete unused keys
        for (let key in queryObject) {
          console.log(key, queryObject[key]);
          if (!topLevelKeys.includes(key)) {
            console.log('deleting ' + key);
            delete queryObject[key];
          }
        }

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

        if (typeof queryObject.filters === 'object') {
          for (let filterKey in queryObject.filters) {

            // Operate on MinMaxRange Keys
            if (minMaxRangeKeys.includes(filterKey)) {
              console.log('MinMaxRange ', filterKey);
              // convert [0,5] to {min:float, max:float}
              let tempArray = queryObject.filters[filterKey];
              if (tempArray.length = 1) {
                // sometimes it returns with 1 entry ommitting 0 for the range
                queryObject.filters[filterKey] = {min: 0, max: tempArray[0]};
              } else {
                queryObject.filters[filterKey] = {min: tempArray[0], max: tempArray[1]};
              }
            }
          }
        }

        // Resolve the Promise with a final object
        resolve(queryObject);
      }
      catch (error) {
        console.log(error);
        reject({error: 'Failed to parse query string.'});
      }
    });
  }
}
