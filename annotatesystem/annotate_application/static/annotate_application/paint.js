var a;
var b;
var c;
var d;
if (window.addEventListener) {
  window.addEventListener(
    "load",
    function () {
      var canvas, context, canvaso, contexto, file_input;

      // По умолчанию линия - инструмент по умолчанию
      var tool;
      var tool_default = "rect";

      function init() {
        canvaso = document.getElementById("tablet");
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

        var container = canvaso.parentNode;
        canvas = document.createElement("canvas");
        if (!canvas) {
          alert("Ошибка! Не могу создать canvas элемент!");
          return;
        }

        canvas.id = "imageTemp";
        canvas.width = canvaso.width;
        canvas.height = canvaso.height;
        container.appendChild(canvas);

        context = canvas.getContext("2d");

        // Получаем инструмент из option
        var tool_select = document.getElementById("tools");
        if (!tool_select) {
          alert("Ошибка! Элемент tools не найден!");
          return;
        }
        tool_select.addEventListener("change", ev_tool_change, false);

        // Активируем способ рисования по-умолчанию
        if (tools[tool_default]) {
          tool = new tools[tool_default]();
          tool_select.value = tool_default;
        }

        canvas.addEventListener("mousedown", ev_canvas, false);
        canvas.addEventListener("mousemove", ev_canvas, false);
        canvas.addEventListener("mouseup", ev_canvas, false);

        file_input.addEventListener("change", ev_upload_picture);

        var SaveButton = document.getElementsByClassName("saveButton")[0]
        console.log(SaveButton)
        

        SaveButton.addEventListener("click", saveImage, false)

        var GetButton = document.getElementsByClassName("getButton")[0]
        GetButton.addEventListener("click", GetImage, false)

      }

      function ev_canvas(ev) {
        if (ev.layerX || ev.layerX == 0) {
          ev._x = ev.layerX;
          ev._y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) {
          ev._x = ev.offsetX;
          ev._y = ev.offsetY;
        }

        var func = tool[ev.type];
        if (func) {
          func(ev);
        }
      }

      // Обработчик событий для изменения селекта
      function ev_tool_change(ev) {
        if (tools[this.value]) {
          tool = new tools[this.value]();
        }
      }

      // Эта функция вызывается каждый раз после того, как пользователь
      // завершит рисование. Она очищает imageTemp.
      function img_update() {
        console.log(context)
        contexto.drawImage(canvas, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
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

      


      function draw_picture(url) {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          context.drawImage(img, 1, 1);
          img_update();
        };

        img.src = url;
      }

      function ev_upload_picture(ev) {
        if (!FileReader) {
          alert("FileReader не поддерживается");
          return;
        }

        if (!ev.target.files.length) {
          return;
        }
        const fileReader = new FileReader();

        fileReader.addEventListener("load", async () => {
          draw_picture(fileReader.result);
        });

        fileReader.readAsDataURL(ev.target.files[0]);
      }

      // Содержит реализацию каждого инструмента рисования
      var tools = {};
      console.log(tool)

      // Карандаш
      tools.pencil = function () {
        var tool = this;
        this.started = false;

        // Рисуем карандашом
        this.mousedown = function (ev) {
          context.beginPath();
          context.moveTo(ev._x, ev._y);
          tool.started = true;
        };

        this.mousemove = function (ev) {
          if (tool.started) {
            context.lineTo(ev._x, ev._y);
            context.stroke();
          }
        };

        this.mouseup = function (ev) {
          if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
          }
        };
      };

      setTimeout(() => {
        console.log(context)
      }, 1000);

      // Прямоугольник
      tools.rect = function () {
        var tool = this;
        this.started = false;
        console.log("kek")
        this.mousedown = function (ev) {
          tool.started = true;
          tool.x0 = ev._x;
          tool.y0 = ev._y;
          document.getElementById("x1").value = ev._x;
          a = ev._x;
          b = ev._y;
          document.getElementById("y1").value = ev._y;
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

          if (!w || !h) {
            return;
          }

          context.strokeRect(x, y, w, h);
        };

        this.mouseup = function (ev) {
          if (tool.started) {
            tool.mousemove(ev);
            document.getElementById("x2").value = ev._x;
            document.getElementById("y2").value = ev._y;
            c = ev._x;
            d = ev._y;
            tool.started = false;
            img_update();
          }
        };
      };

      // Линия
      tools.line = function () {
        var tool = this;
        this.started = false;

        this.mousedown = function (ev) {
          tool.started = true;
          tool.x0 = ev._x;
          tool.y0 = ev._y;
        };

        this.mousemove = function (ev) {
          if (!tool.started) {
            return;
          }

          context.clearRect(0, 0, canvas.width, canvas.height);

          context.beginPath();
          context.moveTo(tool.x0, tool.y0);
          context.lineTo(ev._x, ev._y);
          context.stroke();
          context.closePath();
        };

        this.mouseup = function (ev) {
          if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
          }
        };
      };

      // Cтрелка
      tools.arrow = function () {
        var tool = this;
        this.started = false;

        this.mousedown = function (ev) {
          tool.started = true;
          tool.x0 = ev._x;
          tool.y0 = ev._y;
        };

        this.mousemove = function (ev) {
          if (!tool.started) {
            return;
          }

          var headLength = Math.abs(tool.x0 - ev.x + (tool.y0 - ev.y)) * 0.18;

          if (headLength < 15) {
            headLength = 15;
          }

          context.clearRect(0, 0, canvas.width, canvas.height);

          var degreesInRadians225 = (225 * Math.PI) / 180;
          var degreesInRadians135 = (135 * Math.PI) / 180;

          // calc the angle of the line
          var dx = ev._x - tool.x0;
          var dy = ev._y - tool.y0;
          var angle = Math.atan2(dy, dx);

          var x225 = ev._x + headLength * Math.cos(angle + degreesInRadians225);
          var y225 = ev._y + headLength * Math.sin(angle + degreesInRadians225);
          var x135 = ev._x + headLength * Math.cos(angle + degreesInRadians135);
          var y135 = ev._y + headLength * Math.sin(angle + degreesInRadians135);

          context.beginPath();
          context.moveTo(tool.x0, tool.y0);
          context.lineTo(ev._x, ev._y);
          context.moveTo(ev._x, ev._y);
          context.lineTo(x225, y225);
          context.moveTo(ev._x, ev._y);
          context.lineTo(x135, y135);
          context.stroke();
        };

        this.mouseup = function (ev) {
          if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
          }
        };
      };

      // Круг
      tools.circle = function () {
        var tool = this;
        this.started = false;

        this.mousedown = function (ev) {
          tool.started = true;
          tool.x0 = ev._x;
          tool.y0 = ev._y;
          document.getElementById("x1").value = ev._x;
          document.getElementById("y1").value = ev._y;
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

          if (!w || !h) {
            return;
          }

          context.beginPath();
          context.arc(x, y, w, 0, 2 * Math.PI, false);

          context.lineWidth = 2;
          context.strokeStyle = "black";
          context.stroke();
        };

        this.mouseup = function (ev) {
          if (tool.started) {
            tool.mousemove(ev);
            document.getElementById("x2").value = ev._x;
            document.getElementById("y2").value = ev._y;
            tool.started = false;
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
  var canvas = document.getElementById("tablet");
  if (canvas.getContext) {
    var context = canvas.getContext("2d");
    x1 = document.getElementById("x1").value;
    x2 = document.getElementById("x2").value;
    y1 = document.getElementById("y1").value;
    y2 = document.getElementById("y2").value;
    context.strokeRect(x1, y1, x2 - x1, y2 - y1);
  }
}

function clearcanvas1() {
  var canvas = document.getElementById("tablet"),
    context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
}


