const axios = require('axios');

module.exports = {
  fetchLoans: (customFilters) => {
    console.log(customFilters);
    // Use custom Filters if present
    const offset = (typeof customFilters !== 'undefined' && typeof customFilters.offset !== 'undefined') ? customFilters.offset : '0';
    const limit = (typeof customFilters !== 'undefined' && typeof customFilters.limit !== 'undefined') ? customFilters.limit : '6';
    const filters = (typeof customFilters !== 'undefined' && typeof customFilters.filters !== 'undefined') ? JSON.stringify(customFilters.filters).replace(/"/g, '') : '{status: fundRaising}';
    const sort_by = (typeof customFilters !== 'undefined' && typeof customFilters.sort_by !== 'undefined') ? customFilters.sort_by : 'newest';

    // TODO: Refactor to re-write prepared query object to a string
    // - JSON.stringify then strip wrapping brakets and remove all quotation marks
    // - Optionally, we could look at using GraphQL variables rather than template literal expressions

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
