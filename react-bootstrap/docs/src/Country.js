import React from 'react';

import NavMain from './NavMain';
import PageHeader from './PageHeader';
import PageFooter from './PageFooter';
import Row from '../../src/Row';
import Col from '../../src/Col';
import Thumbnail from '../../src/Thumbnail';


var axios = require('axios');

class Country extends React.Component {

  constructor(props) {
    super(props);

    this.renderCountry = this.renderCountry.bind(this);
    this.state = {
      country: {},
      type: "country"
    };

    //Following snippet of code from ideasandpixels.com
    var $_GET = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }

        $_GET[decode(arguments[1])] = decode(arguments[2]);
    });

    var that = this;
    axios.create({
      baseURL: 'https://swe-endangered-animals.appspot.com/',
      headers: {"Access-Control-Allow-Origin": "*"}
    }).get('/single_country_data/?country_name='+$_GET['q'])
      .then(function(data) {
        that.setState({
          country: data.data
        });
    });
  };

  shouldComponentUpdate() {
    return true;
  };


  changeURL(type, data){
    if(typeof data == "undefined")
      data = "";
    this.context.router.push("/"+type+".html/?q="+data);
  };

  renderCountry(instance) {
    return (
      <Thumbnail src={ instance.flag } width="100%" height="33%">

        <br/><br/>

        <Row>
          <Col sm={2}>
            <b><a href="animals.html">Animals</a>:</b>
          </Col>
          <Col sm={2}>
            <ul>
              {
                instance.assoc_animals.map(function(animal, i){
                  return (
                    <a key={"ah"+i} onClick={() => { this.changeURL('animal', animal) }} >
                      <li key={"h"+i}>{ animal }</li>
                    </a>
                  )
                }.bind(this))
              }
            </ul>
          </Col>
        </Row>
        <Row>
          <Col sm={2}>
            <b><a href="habitats.html">Habitats</a>:</b>
          </Col>
          <Col sm={2}>
            <ul>
              {
                instance.assoc_habitats.map(function(habitat, i){
                  return (
                    <a key={"ah"+i} onClick={() => { this.changeURL('habitat', habitat) }} >
                      <li key={"h"+i}>{ habitat }</li>
                    </a>
                  )
                }.bind(this))
              }
            </ul>
          </Col>
        </Row>

        <br/><br/>
        
        <iframe id="gmap_canvas" width="100%" src={ "https://maps.google.com/maps?q=" + instance.name + "&t=k&z=6&ie=UTF8&iwloc=&output=embed" } frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0">
        </iframe>
      </Thumbnail>
    );
  };

  render() {
    if(typeof this.state.country.name == "undefined")
      return <div />
    
    return (
      <div>
        <NavMain activePage={this.state.type} />

        <PageHeader
          title={ this.state.country.name } />

              <Row>
                { this.renderCountry(this.state.country) }
              </Row>

        <PageFooter />
      </div>
    );
  };
}

Country.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Country;
