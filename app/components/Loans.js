const React = require('react');
const PropTypes = require('prop-types');
const api = require('../utils/api');
const queryParser = require('../utils/query-parser');

function LoanGrid (props) {
   return (
     <ul className='loan-list'>
      { props.loans.map( (loan, index) => {
        return (
          <li key={index} className='loan-card'>
            <a href={'https://www.kiva.org/lend/' + loan.id}>
              <img
                className='borrower-photo'
                src={'https://www-kiva-org.global.ssl.fastly.net/img/s280/' + loan.image.hash + '.jpg'}
                alt={'Picture of ' + loan.name}
              />
            </a>

            <div className='loan-details'>
              <div className='name-and-country'>
                <a className='borrower-name' href={'https://www.kiva.org/lend/' + loan.id}>{loan.name}</a>
                <span className={"f16 " +  loan.location.country.isoCode.toLowerCase()}></span>
                <span className='borrower-country'>{loan.location.country.name}</span>
              </div>
              <div className='loan-use'>A loan of ${parseInt(loan.loanAmount).toLocaleString()} helps to {loan.use}</div>
            </div>

            <div className='fundraising-meter'>
              <span className="meter" style={{width: parseInt(loan.fundedAmount) / parseInt(loan.loanAmount)* 100 +'%'}}></span>
              <span className="caption">${(loan.loanAmount - loan.fundedAmount).toLocaleString()} to go</span>
            </div>
            <a href={'https://www.kiva.org/lend/' + loan.id}>
              <div className='learn-more'>Learn more / lend</div>
            </a>
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
  render() {
    return (
      <div>
        {!this.props.loandata
          ? <p>LOADING</p>
          : <LoanGrid loans={this.props.loandata} />
        }
      </div>
    )
  }
}

module.exports = Loans;
