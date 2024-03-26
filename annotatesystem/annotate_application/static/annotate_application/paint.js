var a;
var b;
var c;
var d;

var coord_map = new Map();
var counter_clet = 1;
var is_zoom = true;
if (window.addEventListener) {
  window.addEventListener(
    "load",
    function () {
      var canvas, context, canvaso, contexto, file_input;

      // По умолчанию линия - инструмент по умолчанию
      var tool;
      var tool_default = "rect";

      function init() {
        canvaso = document.getElementById("draw_canvas");
        file_input = document.getElementById("file-input");
        if (!canvaso) {
          alert("Ошибка! Canvas элемент не найден!");
          return;
        }

        if (!canvaso.getContext) {
          alert("Ошибка! canvas.getContext не найден!");
          return;
        }

        contexto = canvaso.getContext("2d");
        if (!contexto) {
          alert("Ошибка! Не могу получить getContext!");
          return;
        }

//        var container = canvaso.parentNode;
//        canvas = document.createElement("canvas");
        canvas = canvaso;
        if (!canvas) {
          alert("Ошибка! Не могу создать canvas элемент!");
          return;
        }

//        canvas.id = "imageTemp";
        canvas.width = canvaso.width;
        canvas.height = canvaso.height;
//        container.appendChild(canvas);

        context = canvas.getContext("2d");

        // Получаем инструмент из option
//        var tool_select = document.getElementById("rect");
//        if (!tool_select) {
//           alert("Ошибка! Элемент tools не найден!");
//           return;
//        }
//        tool_select.addEventListener("change", ev_tool_change, false);

        // Активируем способ рисования по-умолчанию
        if (tools[tool_default]) {
          tool = new tools[tool_default]();
//          tool_select.value = tool_default;
        }

        canvas.addEventListener("mousedown", ev_canvas, false);
        canvas.addEventListener("mousemove", ev_canvas, false);
        canvas.addEventListener("mouseup", ev_canvas, false);

//        file_input.addEventListener("change", ev_upload_picture);

//        var SaveButton = document.getElementsByClassName("saveButton")[0]
//        console.log(SaveButton)
//
//
//        SaveButton.addEventListener("click", saveImage, false);

//        var GetButton = document.getElementsByClassName("getButton")[0]
//        GetButton.addEventListener("click", GetImage, false)

      }

      function ev_canvas(ev) {
        let rect_canv = canvas.getBoundingClientRect()
        if (ev.layerX || ev.layerX == 0) {
          ev._x = ev.layerX - rect_canv.left;
          ev._y = ev.layerY - rect_canv.top;
        } else if (ev.offsetX || ev.offsetX == 0) {
          ev._x = ev.offsetX - rect_canv.left;
          ev._y = ev.offsetY - rect_canv.top;
        }

        var func = tool[ev.type];
        if (func) {
          func(ev);
        }
      }

      // Обработчик событий для изменения селекта
//      function ev_tool_change(ev) {
//        if (tools[this.value]) {
//          tool = new tools[this.value]();
//        }
//      }

      // Эта функция вызывается каждый раз после того, как пользователь
      // завершит рисование. Она очищает imageTemp.
      function img_update() {
        console.log("wwwwww")
//        contexto.drawImage(canvas, 0, 0);
//        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      function GetImage(){
        var inputName = document.getElementsByClassName("valueName")[0]

        var data = {
          name: inputName.value,
        };

        fetch('/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.text())
        .then(response => {
          console.log(response)

          var image = new Image();
          image.src = "data:image/png;base64," + response
          image.onload = function() {
            contexto.drawImage(image, 0, 0);
          };
          // data:image/%s;base64,
        })
        .catch(error => {
          // Handle any errors
          console.error('Error:', error);
        });
      }


      function saveImage(){
        var inputName = document.getElementsByClassName("valueName")[0]

        // var getCanvas = document.getElementById("imageTemp")
        var canvasData = canvaso.toDataURL('image/png')

        var data = {
          data: canvasData,
          name: inputName.value,
          x: a,
          y: b,
          c: c,
          d: d
        };
        console.log(data)
        // Perform the POST request
        fetch('/draw/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          // Handle the response data
          alert("успешно сохранено")
        })
        .catch(error => {
          // Handle any errors
          console.error('Error:', error);
        });
      }




//      function draw_picture(url) {
//        var img = new Image();
//        img.setAttribute("crossOrigin", "anonymous");
//        img.onload = () => {
//          context.drawImage(img, 1, 1);
//          img_update();
//        };
//
//        img.src = url;
//      }

//      function ev_upload_picture(ev) {
//        if (!FileReader) {
//          alert("FileReader не поддерживается");
//          return;
//        }
//
//        if (!ev.target.files.length) {
//          return;
//        }
//        const fileReader = new FileReader();
//
//        fileReader.addEventListener("load", async () => {
//          draw_picture(fileReader.result);
//        });
//
//        fileReader.readAsDataURL(ev.target.files[0]);
//      }

      // Содержит реализацию каждого инструмента рисования
      var tools = {};
//      console.log(tool)

      setTimeout(() => {
        console.log(context)
      }, 1000);

      // Прямоугольник
      tools.rect = function () {

        var tool = this;
        this.started = false;
//        console.log("kek")
        this.mousedown = function (ev) {
          tool.started = true;
          tool.x0 = ev._x;
          tool.y0 = ev._y;
          //document.getElementById("x1").value = ev._x;
          a = ev._x;
          b = ev._y;
          //document.getElementById("y1").value = ev._y;
        };

        this.mousemove = function (ev) {
          if (!tool.started) {
            return;
          }

          var x = Math.min(ev._x, tool.x0),
            y = Math.min(ev._y, tool.y0),
            w = Math.abs(ev._x - tool.x0),
            h = Math.abs(ev._y - tool.y0);

          context.clearRect(0, 0, canvas.width, canvas.height);
          context.strokeStyle = "black";
          for (let key in coord_map) {
            console.log(key, coord_map[key]);
            console.log(coord_map[key][0], coord_map[key][1], coord_map[key][2] - coord_map[key][0], coord_map[key][3] - coord_map[key][1]);
            context.strokeRect(coord_map[key][0], coord_map[key][1], coord_map[key][2] - coord_map[key][0], coord_map[key][3] - coord_map[key][1]);
          }

          if (!w || !h) {
            return;
          }
          context.setLineDash([6]);
          context.strokeStyle = "red";
          context.strokeRect(x, y, w, h);
        };

        this.mouseup = function (ev) {
          if (tool.started) {
            tool.mousemove(ev);
            //document.getElementById("x2").value = ev._x;
            //document.getElementById("y2").value = ev._y;
            c = ev._x;
            d = ev._y;
            tool.started = false;

            coord_map[counter_clet] = [tool.x0, tool.y0, ev._x, ev._y, ""];
            //coord_map.set(counter_clet, [tool.x0, tool.y0, ev._x, ev._y, ""]);

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
            context.strokeRect(tool.x0, tool.y0, ev._x - tool.x0, ev._y - tool.y0);

            console.log(coord_map);
//            console.log(description);

//            fetch('/draw/', {
//                method: 'POST',
//                headers: {
//                'Content-Type': 'application/json'
//                },
//                body: JSON.stringify(coord_map)
//            })

            img_update();
          }
        };
      };




      init();
    },
    false
  );
}

function draw() {
  var canvas = document.getElementById("draw_canvas");
  if (canvas.getContext) {
    var context = canvas.getContext("2d");
    x1 = document.getElementById("x1").value;
    x2 = document.getElementById("x2").value;
    y1 = document.getElementById("y1").value;
    y2 = document.getElementById("y2").value;
//    context.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }
}

function clearcanvas1() {
  var canvas = document.getElementById("draw_canvas"),
    context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
//  var cont = document.getElementById('add_cletka');
//  cont.replaceChildren();
}

function cleanlastcell() {
  var canvas = document.getElementById("draw_canvas"),
    context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
//  var cont = document.getElementById('add_cletka');
//  cont.removeChild(cont.lastChild);
}
 function savedescrip(cur_count) {
    var cont = document.getElementById(cl_descrip`$cur_count`);
    coord_map[`$cur_count`][4] = cont.value;
    //coord_map.get(cur_count)[4] = cont.value;
    console.log(cur_count);
    console.log(coord_map);

 }

 function save_rect() {
     console.log("SAVESAVESAVE");
     console.log(JSON.stringify(coord_map));
          console.log(coord_map);
    var canvaso = document.getElementById("draw_canvas");
    coord_map['img'] = canvaso.toDataURL('image/png');
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
