var coord_map = new Map();
var counter_clet = 1;
var is_zoom = true;

//-----------------------------------------------------
let canvas = document.getElementById("draw_canvas");
  // Размеры canvas
  canvas.width = 800;
  canvas.height = 550;
  let scaleLowerLimit = 0.25;
  let scaleUpperLimit = 5;

  let current_picture = new Image;

  window.onload = function(){

        var context, canvaso, contexto, file_input;
        var tools = {};
        var tool;
        var tool_default = "rect";

        canvaso = document.getElementById("draw_canvas");
        contexto = canvaso.getContext("2d");
        canvas = canvaso;
        context = canvas.getContext("2d");
        if (tools[tool_default]) {
          tool = new tools[tool_default]();
        }
        var tool = tools;
        tools.started = false;

        var ctx = canvas.getContext('2d');
        trackTransforms(ctx);
        function redraw(){
          // Clear the entire canvas
          var p1 = ctx.transformedPoint(0,0);
          var p2 = ctx.transformedPoint(canvas.width,canvas.height);
          ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

          ctx.drawImage(current_picture,0,0);
          context.strokeStyle = "black";
          for (let key in coord_map) {
            //console.log(key, coord_map[key]);
            //console.log(coord_map[key][0], coord_map[key][1], coord_map[key][2] - coord_map[key][0], coord_map[key][3] - coord_map[key][1]);
            context.strokeRect(coord_map[key][0], coord_map[key][1], coord_map[key][2] - coord_map[key][0], coord_map[key][3] - coord_map[key][1]);
          }
        }
          redraw();

        if (window.FileList && window.File && window.FileReader) {
        document.getElementById('input').addEventListener('change', event => {
          const file = event.target.files[0];
          const reader = new FileReader();
          redraw();
          reader.addEventListener('load', event => {

            current_picture.src = event.target.result;
            redraw();
          });
          reader.readAsDataURL(file);
              redraw();

        });
        }

        var lastX=canvas.width/2, lastY=canvas.height/2;
        var dragStart,dragged;
        canvas.addEventListener('mousedown',function(evt){
            let rect_canv = canvas.getBoundingClientRect()
            if (evt.layerX || evt.layerX == 0) {
              evt._x = evt.layerX - rect_canv.left;
              evt._y = evt.layerY - rect_canv.top;
            } else if (evt.offsetX || evt.offsetX == 0) {
              evt._x = evt.offsetX - rect_canv.left;
              evt._y = evt.offsetY - rect_canv.top;
            }

            var func = tool[evt.type];
            if (func) {
              func(evt);
            }

          if (is_zoom) {
              document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
              lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
              lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
              dragStart = ctx.transformedPoint(lastX,lastY);
              dragged = false;
          } else {
              redraw();
              tool.started = true;
              tool.x0 = evt._x;
              tool.y0 = evt._y;
              a = evt._x;
              b = evt._y;
          }
        },false);
        canvas.addEventListener('mousemove',function(evt){
            let rect_canv = canvas.getBoundingClientRect()
            if (evt.layerX || evt.layerX == 0) {
              evt._x = evt.layerX - rect_canv.left;
              evt._y = evt.layerY - rect_canv.top;
            } else if (evt.offsetX || evt.offsetX == 0) {
              evt._x = evt.offsetX - rect_canv.left;
              evt._y = evt.offsetY - rect_canv.top;
            }

            var func = tool[evt.type];
            if (func) {
              func(evt);
            }
            if (is_zoom) {
              lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
              lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
              dragged = true;
              if (dragStart){
                var pt = ctx.transformedPoint(lastX,lastY);
                ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
                redraw();
              }
          } else {
                redraw();
              if (!tool.started) {
                return;
              }
              var x = Math.min(evt._x, tool.x0),
                y = Math.min(evt._y, tool.y0),
                w = Math.abs(evt._x - tool.x0),
                h = Math.abs(evt._y - tool.y0);

//              context.clearRect(0, 0, canvas.width, canvas.height);
              context.strokeStyle = "black";
              for (let key in coord_map) {
                //console.log(key, coord_map[key]);
                //console.log(coord_map[key][0], coord_map[key][1], coord_map[key][2] - coord_map[key][0], coord_map[key][3] - coord_map[key][1]);
                context.strokeRect(coord_map[key][0], coord_map[key][1], coord_map[key][2] - coord_map[key][0], coord_map[key][3] - coord_map[key][1]);
              }

              if (!w || !h) {
                return;
              }
              context.setLineDash([6]);
              context.strokeStyle = "red";
              context.strokeRect(x, y, w, h);
          }
        },false);
        canvas.addEventListener('mouseup',function(evt){
            let rect_canv = canvas.getBoundingClientRect()
            if (evt.layerX || evt.layerX == 0) {
              evt._x = evt.layerX - rect_canv.left;
              evt._y = evt.layerY - rect_canv.top;
            } else if (evt.offsetX || evt.offsetX == 0) {
              evt._x = evt.offsetX - rect_canv.left;
              evt._y = evt.offsetY - rect_canv.top;
            }

            var func = tool[evt.type];
            if (func) {
              func(evt);
            }
          if (is_zoom) {
              dragStart = null;
              if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
          } else {
//            redraw();
            if (tool.started) {
//            tool.mousemove(evt);
            c = evt._x;
            d = evt._y;
            tool.started = false;

            coord_map[counter_clet] = [tool.x0, tool.y0, evt._x, evt._y];

//            let div = document.createElement('div');
//            div.className = "row my-2";
//            //div.innerHTML = <label class=\"plain_text\">Kletka #${counter_clet - 1}</label>;
//            div.innerHTML = `<div class="dropdown">
//                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
//                    Клетка №${counter_clet}
//                  </button>
//                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
//                    <li><label class="plain_text reg_label">Описание</label>
//                          <textarea class="form-control mb-3" id=cl_descrip${counter_clet} name="description">Example</textarea></li>
//          <li><label onclick=savedescrip(${counter_clet})>Сохранить</label></li>
//            <li><label onclick="cleanlastcell()">Удалить</label></li>
//                  </ul>
//                </div>`;
//            add_cletka.append(div);

            counter_clet = counter_clet + 1;

            context.setLineDash([6]);
            context.strokeStyle = "black";
            context.strokeRect(tool.x0, tool.y0, evt._x - tool.x0, evt._y - tool.y0);
            //console.log(coord_map);
          }
          }
        },false);

        var scaleFactor = 1.1;
        var zoom = function(clicks){
          var pt = ctx.transformedPoint(lastX,lastY);
          ctx.translate(pt.x,pt.y);
          var factor = Math.pow(scaleFactor,clicks);
    //      ctx.scale(factor,factor);
          var scale = ctx.getTransform().a;
          var decision = true;
          if (factor < 1) {
          // this is zoom out
            if (scale < scaleLowerLimit) {
                decision = false;
            }
          } else if (factor > 1) {
          // this is zoom in
            if (scale > scaleUpperLimit) {
                decision = false;
            }
          } else {
            decision = false;
          }
          if (decision == true) {
            ctx.scale(factor, factor);
          }



          ctx.translate(-pt.x,-pt.y);
          redraw();



        }

        var handleScroll = function(evt){
          var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
          if (delta) zoom(delta);
          return evt.preventDefault() && false;
        };
        canvas.addEventListener('DOMMouseScroll',handleScroll,false);
        canvas.addEventListener('mousewheel',handleScroll,false);
      };


  // Adds ctx.getTransform() - returns an SVGMatrix
  // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
  function trackTransforms(ctx){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function(){
      savedTransforms.push(xform.translate(0,0));
      return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function(){
      xform = savedTransforms.pop();
      return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx,sy){
      xform = xform.scaleNonUniform(sx,sy);
      return scale.call(ctx,sx,sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
      xform = xform.rotate(radians*180/Math.PI);
      return rotate.call(ctx,radians);
    };
    var translate = ctx.translate;
    ctx.translate = function(dx,dy){
      xform = xform.translate(dx,dy);
      return translate.call(ctx,dx,dy);
    };
    var transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
      var m2 = svg.createSVGMatrix();
      m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
      xform = xform.multiply(m2);
      return transform.call(ctx,a,b,c,d,e,f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx,a,b,c,d,e,f);
    };
    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
      pt.x=x; pt.y=y;
      return pt.matrixTransform(xform.inverse());
    }
  }


//--------------------------------------------



 function save_rect() {
     console.log("SAVESAVESAVE");
     console.log(JSON.stringify(coord_map));
          console.log(coord_map);
    var canvaso = document.getElementById("draw_canvas");
//    coord_map['img'] = canvaso.toDataURL('image/png');
    fetch('/draw/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(coord_map)
     })
 }

 function zoom_tool() {
    is_zoom = true;
 }
 function draw_tool() {
    is_zoom = false;
 }