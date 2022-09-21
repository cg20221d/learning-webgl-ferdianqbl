function main() {
  const canvas = document.querySelector("#render");
  const gl = canvas.getContext("webgl"); // mengaktifkan property2 gambar

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // === mendefinisikan shaders code ===> Dijalankan GPU
  var vertices = [
    0.5, 0.0, 0.0, 1.0, 1.0,   // A: kanan atas    (BIRU LANGIT)
    0.0, -0.5, 1.0, 0.0, 1.0,  // B: bawah tengah  (MAGENTA)
    -0.5, 0.0, 1.0, 1.0, 0.0,  // C: kiri atas     (KUNING)
    0.0, 0.5, 1.0, 1.0, 1.0    // D: atas tengah   (PUTIH)
  ];
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);



  const vertexShaderCode = `
  attribute vec2 aPosition;
  attribute vec3 aColor;
  uniform float uTheta;
  uniform float uX;
  uniform float uY;
  varying vec3 vColor;
void main() {
  vColor = aColor;
  float x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y + uX;
  float y = cos(uTheta) * aPosition.x + sin(uTheta) * aPosition.y + uY;
  gl_Position = vec4(x, y, 0.0, 1.0);
  vColor = aColor;
}
`;

  const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShaderObject, vertexShaderCode);
  gl.compileShader(vertexShaderObject);

  // Fragment shader --> untuk warna
  const fragmentShaderCode = `
  precision mediump float;
  varying vec3 vColor;
void main() {
  // float r = 0.0;
  // float g = 0.0;
  // float b = 0.0;
  gl_FragColor = vec4(vColor, 1.0);
}
`;

  const fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER); // membuat objek fragment shader
  gl.shaderSource(fragmentShaderObject, fragmentShaderCode); // menghubungkan objek fragment shader dengan code
  gl.compileShader(fragmentShaderObject); // mengcompile code fragment shader --> jadi (.o)

  // wadah untuk menyimpan vertex shader dan fragment shader --> executable (.exe)
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShaderObject); // menyimpan vertex shader ke dalam program
  gl.attachShader(shaderProgram, fragmentShaderObject);

  gl.linkProgram(shaderProgram);

  gl.useProgram(shaderProgram);

  // Variabel lokal
  var theta = 0.0;
  var x = 0.0;
  var y = 0.0;
  let uTheta = gl.getUniformLocation(shaderProgram, "uTheta");
  let uX = gl.getUniformLocation(shaderProgram, "uX");
  let uY = gl.getUniformLocation(shaderProgram, "uY");

  const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");

  // gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);

  gl.enableVertexAttribArray(aPosition);

  const aColor = gl.getAttribLocation(shaderProgram, "aColor");
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(aColor);


  // ==== Memulai penggambaran ====

  gl.clearColor(1.0, 0.65, 0.0, 1); // mengatur warna background (r, g, b, a)

  gl.clear(gl.COLOR_BUFFER_BIT); // menggambar background

  let freeze = false;

  canvas.addEventListener("click", function () {
    freeze = !freeze;
  });

  document.addEventListener("keydown", function (event) {
    event.code == "Space" ? freeze = !freeze : null;

    if (event.code == "KeyA") {
      x -= 0.1;
    } else if (event.code == "KeyD") {
      x += 0.1;
    }
    else if (event.code == "KeyW") {
      y += 0.1;
    }
    else if (event.code == "KeyS") {
      y -= 0.1;
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.code == "KeyA") {
      x -= 0.0;
    } else if (event.code == "KeyD") {
      x += 0.0;
    }
    else if (event.code == "KeyW") {
      y -= 0.0;
    }
    else if (event.code == "KeyS") {
      y += 0.0;
    }
  });



  function render() {
    gl.clearColor(1.0, 0.65, 0.0, 1.0);  // Oranye
    //            Merah     Hijau   Biru    Transparansi

    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!freeze) {
      theta += 0.01;
      x !== 0 ? theta += x : null;
      y !== 0 ? theta += y : null;
      gl.uniform1f(uTheta, theta);
      gl.uniform1f(uX, x);
      gl.uniform1f(uY, y);
    }
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // setInterval(render, 1000 / 60);
}
