function main() {
  const canvas = document.querySelector("#render");
  const gl = canvas.getContext("webgl"); // mengaktifkan property2 gambar

  // === mendefinisikan shaders code ===> Dijalankan GPU

  // vertex shader --> disimpan sbg string --> untuk posisi
  const vertexShaderCode = `
void main() {
  float x = 0.0;
  float y = 0.0;
  float z = 0.0;
  gl_PointSize = 20.0;
  gl_Position = vec4(x, y, z, 1.0);
  
}
`;

  const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER); // membuat objek vertex shader
  gl.shaderSource(vertexShaderObject, vertexShaderCode); // menghubungkan objek vertex shader dengan code
  gl.compileShader(vertexShaderObject); // mengcompile code vertex shader --> jadi .o

  // Fragment shader --> untuk warna
  const fragmentShaderCode = `
void main() {
  // float r = 0.0;
  // float g = 0.0;
  // float b = 1.0;
  gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
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

  // ==== Memulai penggambaran ====

  gl.clearColor(1.0, 0.65, 0.0, 1); // mengatur warna background (r, g, b, a)

  gl.clear(gl.COLOR_BUFFER_BIT); // menggambar background

  gl.drawArrays(gl.POINTS, 0, 1); // menggambar 1 titik
}
