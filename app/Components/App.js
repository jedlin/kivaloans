const React = require('react');
const Loans = require('./Loans');

class App extends React.Component {
  render() {
    return (
      <div className='container'>
        <Loans />
      </div>
    )
  }
}

module.exports = App;
