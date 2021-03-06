const React = require('react');
const PropTypes = require('prop-types');
var api = require('../utils/api');

function LoanGrid (props) {
   return (
     <ul className='loan-list'>
      { props.loans.map( (loan, index) => {
        return (
          <li key={index} className='loan-card'>
            <ul>
              <li>
                <img
                  className='borrower-photo'
                  src={'https://www-kiva-org.global.ssl.fastly.net/img/s250/' + loan.image.hash + '.jpg'}
                  alt={'Picture of ' + loan.name}
                />
              </li>
              <li>
                <a className='borrower-name' href={'https://www.kiva.org/lend/' + loan.id}>{loan.name}</a>
                <span className='borrower-country'>{loan.location.country.name}</span>
              </li>
              <li className='loan-use'>A loan of ${loan.loanAmount} helps to {loan.use}</li>
              <li className='loan-amount-left'>${loan.loanAmount - loan.fundedAmount} to go</li>
              <a href={'https://www.kiva.org/lend/' + loan.id}>
                <li className='learn-more'>Learn more / lend</li>
              </a>
            </ul>
          </li>
        )
        })}
     </ul>
   )
}
LoanGrid.propTypes = {
  loans: PropTypes.array.isRequired,
}

class Loans extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      loans: null
    }
  };
  componentDidMount () {
    this.updateLoans();
  }

  updateLoans() {
    this.setState( () => {
      return {
        loans: null
      }
    })

  api.fetchLoans()
      .then( (loans) => {
        this.setState( () => {
          return {
            loans: loans
          }
        })
      });
  };

  render() {
    return (
      <div>
        {!this.state.loans
          ? <p>LOADING</p>
          : <LoanGrid loans={this.state.loans} />
        }
      </div>
    )
  }
}

module.exports = Loans;
