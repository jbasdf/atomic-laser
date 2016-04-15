"use strict";

import React                    from 'react';
import assets                   from '../libs/assets';
import Api                      from '../libs/api';

class Home extends React.Component {

  start(){
    Api.post('/laser_start', '', null, null, {}, {});
  }

  stop(){
    Api.post('/laser_stop', '', null, null, {}, {});
  }

  render(){

    const img = assets("./images/atomicjolt.jpg");

    return <div>
      <img src={img} />
      <button onClick={(e) => { e.preventDefault(); this.start(); }}>Start</button>
      <button onClick={(e) => { e.preventDefault(); this.stop(); }}>Stop</button>
    </div>;
  }

}

export { Home as default };