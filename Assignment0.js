// For Vertex Shader Source
const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
        gl_Position = vec4(a_position, 0, 1);
    }
`;

// For Fragment Shader Source
const fragmentShaderSource = `
    void main() {
        gl_FragColor = vec4(1, 0, 0, 1); // I'm setting triangle color to red
    }
`;

// For Function to create and compile a shader
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// For Function to create and link a shader program
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program failed to link:', gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

// Part I initialize WebGL
function initWebGL() {
    const canvas = document.querySelector("#hyunhoCanvas"); 
    const gl = canvas.getContext('webgl');
    if (!gl) {
        alert('WebGL not supported');
        return null;
    }

    // Setting clear color to Aggie Blue
    gl.clearColor(0.0, 0.33, 0.62, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT); 

    // For Compiling shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(shaderProgram);
    return { gl, shaderProgram };
}

// Using function to draw a triangle
function drawTriangle(gl, shaderProgram, x, y) {
    const vertices = new Float32Array([
        x, y + 0.1, 
        x - 0.1, y - 0.1, 
        x + 0.1, y - 0.1  
    ]);

    // Creating a buffer for the triangle's vertices
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Getting the position attribute location from the shader
    const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Drawing the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// Function to draw all triangles
function drawAllTriangles(gl, shaderProgram, triangles) {
    // Clear the canvas
    gl.clearColor(0.0, 0.33, 0.62, 1.0); 
    gl.clear(gl.COLOR_BUFFER_BIT); 

    // Draw each triangle
    triangles.forEach(triangle => {
        drawTriangle(gl, shaderProgram, triangle.x, triangle.y);
    });
}

// Main function to set up the application
function main() {
    const { gl, shaderProgram } = initWebGL(); // Initialize WebGL
    if (!gl) return;

    const canvas = document.querySelector("#hyunhoCanvas");
    const triangles = []; // Array to store triangle positions

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / canvas.width * 2 - 1; 
        const y = (rect.bottom - event.clientY) / canvas.height * 2 - 1; 

        // Add the triangle's position to the array
        triangles.push({ x, y });

        // Redraw all triangles
        drawAllTriangles(gl, shaderProgram, triangles);
    });

    // Clear canvas functionality
    document.addEventListener('keydown', (event) => {
        if (event.key === 'x') {
            triangles.length = 0; 

            gl.clearColor(0.0, 0.33, 0.62, 1.0); 
            gl.clear(gl.COLOR_BUFFER_BIT); 
        }
    });
}

main();
