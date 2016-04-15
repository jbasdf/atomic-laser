var EtherDream = require('./etherdream.js').EtherDream;


function sendframe(connection, data, callback) {
  console.log('send frame');
  connection.write(data, 30000, function() {
    console.log('frame written.');
    callback();
  });
}

console.log('Looking for EtherDream hosts...');
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
      var scale = 1000;

      x0 = x0 * scale;
      y0 = y0 * scale;
      x1 = x1 * scale;
      y1 = y1 * scale;

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

      var dt = new Date();
      var hours = dt.getHours();
      var mins = dt.getMinutes();
      var secs = dt.getSeconds();
      var ms = dt.getMilliseconds();

      var scale = 0.20;
      var xoffset = -5000;

      console.log('nextframe', phase, shouldfill, conn.fullness, conn.points_in_buffer, dt, hours,mins,secs);

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

      // sec
      var k = secs;
      var c = Math.cos(k * Math.PI / 30.0);
      var s = -Math.sin(k * Math.PI / 30.0);
      drawline(framedata,
        0+xoffset,0,
        30000*s*scale+xoffset,30000*c*scale,
        rr,gg,bb
        //0,0,32768
      );

      // minutes
      var k = mins;
      var c = Math.cos(k * Math.PI / 30.0);
      var s = -Math.sin(k * Math.PI / 30.0);
      drawline(framedata,
        0+xoffset,0,
        20000*s*scale+xoffset,20000*c*scale,
        rr,gg,bb
      );

      // hours
      var k = hours;
      var c = Math.cos(k * Math.PI / 6.0);
      var s = -Math.sin(k * Math.PI / 6.0);
      drawline(framedata,
        0+xoffset,0,
        15000*s*scale+xoffset,15000*c*scale,
        // 65535,65535,32768
        rr,gg,bb
      );

      callback(framedata);
    };

    function snakeRender(phase, callback){
      var frameData = [];
      var shouldfill = conn.fullness < 1000;

      var scale = 10000;
      // var xoffset = -5000;

// (8,20), (8,19), (9,19), (9,20), (8,20)
      drawline(frameData, 8,20, 8,19, 65535,0,0);
      drawline(frameData, 8,19, 9,19, 65535,0,0);
      drawline(frameData, 9,19, 9,20, 65535,0,0);
      drawline(frameData, 9,19, 9,20, 65535,0,0);
      drawline(frameData, 9,20, 8,20, 65535,0,0);

      // Line 2: (2,20), (3,20), (3,19), (2,19), (2,20)

      // Line 3: (3,17), (3,16), (4,16), (4,17), (3,17)
      // Line 4: (7,17),(7,16), (8,16), (8,17), (7,17)
      // Line 5: (4,8), (6,8), (6,9), (5,9), (5,5),
    //     (4,5), (4,6), (6,6), (6,7), (4,7), (4,8)
      // Line 6: (3,12), (3,13), (5,13),
    //     (5,12), (3,12)
      // Line 7: (0,13), (0,16), (1,16), (1,17), (2,17), (2,18), (3,18),
    //     (3,19), (4,19), (4,18), (7,18), (7,19), (8,19), (8,18), (9,18), (9,17),
    //     (10,17), (10,16), (11,16), (11,13), (10,13), (10,15), (9,15), (9,13), (8,13),
    //     (8,14), (3,14), (3,13), (2,13), (2,15), (1,15), (1,13), (0,13)

      drawline(frameData, 0,13, 0,16, 65535,0,0);
      drawline(frameData, 1,16, 1,17, 65535,0,0);
      drawline(frameData, 1,15, 1,13, 65535,0,0);
      drawline(frameData, 2,17, 2,18, 65535,0,0);
      drawline(frameData, 2,13, 2,15, 65535,0,0);
      drawline(frameData, 3,18, 3,19, 65535,0,0);
      drawline(frameData, 3,14, 3,13, 65535,0,0);
      drawline(frameData, 4,19, 4,18, 65535,0,0);
      drawline(frameData, 7,18, 7,19, 65535,0,0);
      drawline(frameData, 8,19, 8,18, 65535,0,0);
      drawline(frameData, 8,13, 8,14, 65535,0,0);
      drawline(frameData, 9,18, 9,17, 65535,0,0);
      drawline(frameData, 9,15, 9,13, 65535,0,0);
      drawline(frameData, 10,17, 10,16, 65535,0,0);
      drawline(frameData, 10,13, 10,15, 65535,0,0);
      drawline(frameData, 11,16, 11,13, 65535,0,0);

      drawline(frameData, 11,13, 10,13, 65535,0,0);
      drawline(frameData, 9,13, 8,13, 65535,0,0);
      drawline(frameData, 3,13, 2,13, 65535,0,0);
      drawline(frameData, 1,13, 0,13, 65535,0,0);
      drawline(frameData, 8,14, 3,14, 65535,0,0);
      drawline(frameData, 10,15, 9,15, 65535,0,0);
      drawline(frameData, 2,15, 1,15, 65535,0,0);
      drawline(frameData, 0,16, 1,16, 65535,0,0);
      drawline(frameData, 10,16, 11,16, 65535,0,0);
      drawline(frameData, 1,17, 2,17, 65535,0,0);
      drawline(frameData, 9,17, 10,17, 65535,0,0);
      drawline(frameData, 2,18, 3,18, 65535,0,0);
      drawline(frameData, 4,18, 7,18, 65535,0,0);
      drawline(frameData, 8,18, 9,18, 65535,0,0);
      drawline(frameData, 7,19, 8,19, 65535,0,0);
      drawline(frameData, 3,19, 4,19, 65535,0,0);

      // Line 8:
    //   (13,12), (13,9), (14,9), (14,12), (13,12)
      // Line 9: (19,0), (8,0), (8,2), (9,2),
    //     (9,3), (12,3), (12,4), (13,4), (13,5), (14,5), (14,4), (15,4), (15,3),
    //     (18,3), (18,2), (19,2), (19,0) Line 10: (6,13), (8,13), (8,12), (6,12), (6,13)

      callback(frameData);
    };

    var g_phase = 0;
    function frameProvider(callback) {
      g_phase += 1;
      snakeRender(g_phase, callback);
    }

    conn.streamFrames(20000, frameProvider.bind(this));

  });
});