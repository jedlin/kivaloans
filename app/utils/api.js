const axios = require('axios');

module.exports = {
  fetchLoans: () => {
    return axios.post('https://api.kivaws.org/graphql', {
      query: `
     {
       loans (filters: {status:fundRaising}, limit: 6) {
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
        return response.data.data.loans.values;
    })
  }
}
