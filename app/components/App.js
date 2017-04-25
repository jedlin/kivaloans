const React = require('react');
const Loans = require('./Loans');
const api = require('../utils/api');
const queryParser = require('../utils/query-parser');

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loans: null
    }
  }

  // initialize fetch of loan data
  componentDidMount() {
    this.updateLoans();
  }
  
  // fetch + format loan data then set it to state
  updateLoans() {
    console.log(window.location.search);
    // parse query string
    queryParser.parseQueryParams(window.location.search)
      // transform query object
      .then( response => queryParser.transformQueryObjectWithFilters(response) )
      // fetch loans with prepared query
      .then( response => api.fetchLoans(response) )
      // set state with returned loans
      .then( loans => this.setState( () => { return { loans: loans } } ) )
      // catch any errors in the promise chain
      .catch(
        (error) => {
          console.log(error);
        }
      );
  };

  render() {
    return (
      <div className='container'>
        <Loans loandata={this.state.loans} />
      </div>
    )
  }
}

module.exports = App;
