var EtherDream = require('./etherdream.js').EtherDream;

function sendframe(connection, data, callback) {
  console.log('send frame');
  connection.write(data, 30000, function() {
    console.log('frame written.');
    callback();
  });
}

EtherDream.findFirst(function(all) {
  if (all.length == 0) {
    console.log('Didn\'t find any EtherDream on the network.');
    return;
  }

  console.log('Found', all);

  EtherDream.connect(all[0].ip, all[0].port, function(conn) {

    // console.log('Connected', conn);
    if (!conn) {
      return;
    }

    function drawline(framedata, x0,y0, x1,y1, r,g,b) {
      var dx = Math.abs(x1 - x0);
      var dy = Math.abs(y1 - y0);
      var d = Math.round(4 + (Math.sqrt(dx*dx + dy*dy) / 400));

      var jumpframes = 5;
      var stopframes = 5;
      var lineframes = d;

      for(var i=0; i<jumpframes; i++) {
        var pt = {};
        pt.x = x0;
        pt.y = y0;
        pt.r = 0;
        pt.g = 0;
        pt.b = 0;
        pt.control = 0;
        pt.i = 0;
        pt.u1 = 0;
        pt.u2 = 0;
        framedata.push(pt);
      }

      for(var i=0; i<lineframes; i++) {
        var pt = {};
        pt.x = (x0 + (x1 - x0) * (i / (lineframes - 1)));
        pt.y = (y0 + (y1 - y0) * (i / (lineframes - 1)));
        pt.r = r;
        pt.g = g;
        pt.b = b;
        pt.control = 0;
        pt.i = 0;
        pt.u1 = 0;
        pt.u2 = 0;
        framedata.push(pt);
      }

      for(var i=0; i<stopframes; i++) {
        var pt = {};
        pt.x = x1;
        pt.y = y1;
        pt.r = 0;
        pt.g = 0;
        pt.b = 0;
        pt.control = 0;
        pt.i = 0;
        pt.u1 = 0;
        pt.u2 = 0;
        framedata.push(pt);
      }
    }

    function renderframe(phase, callback) {
      var framedata = [];
      var shouldfill = conn.fullness < 1000;

      var scale = 0.20;
      var xoffset = -5000;

      var rr = 0; // 32760 + 32000 * Math.sin(phase / 60.5);
      var gg = 65535; // 32760 + 32000 * Math.sin(phase / 90.3);
      var bb = 0; // 32000 * Math.sin(phase / 370.1);
      /*
      for(var k=0; k<60; k++) {
        var c = Math.cos(k * Math.PI / 30.0);
        var s = -Math.sin(k * Math.PI / 30.0);
        drawline(framedata,
          32000*s,32000*c,
          32760*s,32760*c,
          65535,65535,65535);
      }
      */

      for(var k=0; k<12; k++) {
        var c = Math.cos(k * Math.PI / 6.0);
        var s = -Math.sin(k * Math.PI / 6.0);
        drawline(framedata,
          30000*s*scale+xoffset,30000*c*scale,
          32760*s*scale+xoffset,32760*c*scale,
          rr,gg,bb
          );
      }


      callback(framedata);
    };

    var g_phase = 0;
    function frameProvider(callback) {
      g_phase += 1;
      renderframe(g_phase, callback);
    }

    conn.streamFrames(10000, frameProvider.bind(this));

  });
});
