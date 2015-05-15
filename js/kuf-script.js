/**
 * Created by Yannick Bachteler
 * Version 0.1, 05.05.2015: get code running with random colors
 * Version 1.0, 06.05.2015: final colors
 */


"use strict";       // use mode strict code

/**
 * Global Veriables
 * for indices buffer (ibo_*), vertices buffer (vbo_*) and color buffers (col_*) of body parts
 * program variable (shaderProgram)
 * attribute variables (posAttrib, colAttrib)
 */
var shaderProgram, posAttrib, colAttrib;
var vertices, indicesLines, indicesTris;
var vboPos, iboTris, iboLines;

/**
 *  Get WebGL context
 *  set up general properties
 *  call functions to create shaders, create buffers and draw elements
 */
function startWebGL(model) {
    // Get the WebGL context.
    var canvas = document.getElementById('canvas');
    var gl = canvas.getContext('experimental-webgl');

    // Pipeline setup.
    gl.clearColor(.95, .95, .95, 1);
    // Backface culling.
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    //gl.cullFace(gl.FRONT);

    // Depth(Z)-Buffer.
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Polygon offset of rastered Fragments.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);

    initShaders(gl);
    initBuffers(gl, model);
    render(gl);
}

/**
 *  Links shader together to program
 *  Binds vertex buffer to attribute variable
 */
function initShaders(gl) {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    // Link shader together to program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.bindAttribLocation(shaderProgram, 0, "pos");
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(shaderProgram);
}

/**
 *  Compiles vertex and fragment shaders
 * @param gl    -   canvas context
 * @param id    -   ID to identify shader program
 * @returns {*} -   returns compiled shaders
 */
function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        // Unknown shader type
        return null;
    }

    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

/**
 *  Setup vertex and index buffer objects for body parts
 */
function initBuffers(gl, model) {

    // Fill the data arrays.
    if(model == "funnel") {
        // n, m, umin, umax, vmin, vmax
        var funnel =[18, 15, 0, 1, -3, 2*Math.PI];
        createVertex.vertexFunnel(funnel);

    } else if(model == "ei") {
        // n, m, umin, umax, vmin, vmax
        var egg = [15, 256, -1.0, 2.0, 0.0, 2*Math.PI];
        createVertex.vertexEgg(egg);

    } else if(model == "pseudosphere") {
        // n, m, umin, umax, vmin, vmax
        var pseudosphere = [20, 40, -Math.PI, Math.PI, 0.1, 3.05];
        createVertex.vertexPseudosphere(pseudosphere);

    } else if(model == "torus") {
        // n, m, umin, umax, vmin, vmax
        var torus = [60, 60, -2*Math.PI, 2*Math.PI, -2*Math.PI, 2*Math.PI];
        createVertex.vertexTorus(torus);

    } else {
        return;
    }

    // Setup position vertex buffer object.
    vboPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // Bind vertex buffer to attribute variable.
    posAttrib = gl.getAttribLocation(shaderProgram, 'pos');
    gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);

    // Setup constant color.
    colAttrib = gl.getAttribLocation(shaderProgram, 'col');

    // Setup lines index buffer object.
    iboLines = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        indicesLines, gl.STATIC_DRAW);
    iboLines.numberOfElements = indicesLines.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Setup tris index buffer object.
    iboTris = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesTris, gl.STATIC_DRAW);
    iboTris.numberOfElements = indicesTris.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

/**
 *  Clear framebuffer
 *  Bind buffers to attribute variable
 *  Render primitives
 */
function render(gl) {

    // Clear framebuffer and render primitives.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Setup rendering tris.
    gl.vertexAttrib4f(colAttrib, 0, 9, 0, 1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
    gl.drawElements(gl.TRIANGLES, iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);

    // Setup rendering lines.
    gl.vertexAttrib4f(colAttrib, 0,0,0,1);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
    gl.drawElements(gl.LINES, iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);
}