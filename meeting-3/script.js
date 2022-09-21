function main() {
  const canvas = document.querySelector("#render");
  const gl = canvas.getContext("webgl"); // mengaktifkan property2 gambar

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // === mendefinisikan shaders code ===> Dijalankan GPU

  const x1 = 0.5;
  const y1 = 0.5;
  const x2 = 0.5;
  const y2 = -0.5;
  const x3 = -0.5;
  const y3 = -0.5;
  const x4 = -0.5;
  const y4 = 0.5;

  // const vertices = [x1, y1, x2, y2];
  const vertices = [
    x1, y1, 0.0, 1.0, 1.0,
    x2, y2, 1.0, 0.0, 1.0,
    x3, y3, 1.0, 1.0, 0.0,
    x4, y4, 1.0, 1.0, 1.0
  ];

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // vertex shader --> disimpan sbg string --> untuk posisi
  const vertexShaderCode = `
  attribute vec2 aPosition;
  attribute vec3 aColor;

  varying vec3 vColor;
void main() {
 vColor = aColor;
  float x = aPosition.x;
  float y = aPosition.y;
  float z = 0.0;
  float w = 1.0;
  gl_PointSize = 10.0;
  gl_Position = vec4(x, y, z, w);
  
}
`;

  const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER); // membuat objek vertex shader
  gl.shaderSource(vertexShaderObject, vertexShaderCode); // menghubungkan objek vertex shader dengan code
  gl.compileShader(vertexShaderObject); // mengcompile code vertex shader --> jadi .o

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
  gl.attachShader(shaderProgram, fragmentShaderObject); // menyimpan fragment shader ke dalam program

  gl.linkProgram(shaderProgram); // mengcompile program --> jadi (.exe)

  gl.useProgram(shaderProgram); // menggunakan program

  // ==== Mengajari GPU bagaimana caranya mengoleksi nilai posisi dari ARRAY_BUFFER untuk setiap verteks yang sedang diproses ====

  const aPosition = gl.getAttribLocation(shaderProgram, "aPosition");

  // gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);

  gl.enableVertexAttribArray(aPosition);

  const aColor = gl.getAttribLocation(shaderProgram, "aColor");
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

  gl.enableVertexAttribArray(aColor);


  // ==== Memulai penggambaran ====

  gl.clearColor(1.0, 0.65, 0.0, 1); // mengatur warna background (r, g, b, a)

  gl.clear(gl.COLOR_BUFFER_BIT); // menggambar background

  // gl.drawArrays(gl.POINTS, 0, 1); // menggambar 1 titik
  // gl.drawArrays(gl.POINTS, 0, 4); // menggambar 3 titik
  // gl.drawArrays(gl.LINES, 0, 4); // menggambar garis
  // gl.drawArrays(gl.LINES_LOOP, 0, 4); // menggamba
  // gl.drawArrays(gl.LINE_STRIP, 0, 4); // menggambar
  gl.drawArrays(gl.TRIANGLES, 0, 3); // menggambar
  // gl.drawArrays(gl.TRIANGLES_STRIP, 0, 4); // menggambar
  // gl.drawArrays(gl.TRIANGLES_FAN, 0, 3); // menggambar
}
