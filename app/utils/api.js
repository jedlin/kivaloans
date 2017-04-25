const axios = require('axios');

module.exports = {
  fetchLoans: (customFilters) => {

    // Use custom Filters if present otherwise use default values
    const offset = (typeof customFilters !== 'undefined' && typeof customFilters.offset !== 'undefined') ? customFilters.offset : '0';
    const limit = (typeof customFilters !== 'undefined' && typeof customFilters.limit !== 'undefined') ? customFilters.limit : '6';
    const filters = (typeof customFilters !== 'undefined' && typeof customFilters.filters !== 'undefined') ? customFilters.filters : '{status: fundRaising}';
    const sort_by = (typeof customFilters !== 'undefined' && typeof customFilters.sort_by !== 'undefined') ? customFilters.sort_by : 'newest';

    return axios.post('https://api.kivaws.org/graphql', {
      query: `
     {
       loans (offset: ${offset}, limit: ${limit}, filters: ${filters}, sort_by: ${sort_by}) {
         values {
           id
           name
           image {
             hash
           }
           use
           location {
             country {
               name
             }
           }
            loanAmount
            fundedAmount
         }
       }
     }
     `
    }).then(response => {
        console.log(response);
        return response.data.data.loans.values;
    })
  }
}
