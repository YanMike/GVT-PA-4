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
var gl;
var shaderProgram, posAttrib, colAttrib;
var vertices, indicesLines, indicesTris, colorTris, colorLines;
var vboPos, iboTris, iboLines;

/**
 *  Get WebGL context
 *  set up general properties
 *  call functions to create shaders, create buffers and draw elements
 */
function startWebGL(model) {
    // Get the WebGL context.
    var canvas = document.getElementById('canvas');
    gl = canvas.getContext('experimental-webgl');

    // Pipeline setup.
    gl.clearColor(.95, .95, .95, 1);
    // Backface culling.
    gl.frontFace(gl.CCW);
    gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);
    gl.cullFace(gl.FRONT);

    // Depth(Z)-Buffer.
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // Polygon offset of rastered Fragments.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);

    initShaders();
    initBuffers(model);
    render();
}

/**
 *  Links shader together to program
 *  Binds vertex buffer to attribute variable
 */
function initShaders() {
    // Compile vertex shader.
    var vsSource = '' +
        'attribute vec3 pos;' +
        'attribute vec4 col;' +
        'varying vec4 color;' +
        'void main(){' +
            'color = col;' +
            'gl_Position = vec4(pos, 1);' +
        '}';
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);

    // Compile fragment shader.
    var fsSource = 'precision mediump float;' +
    'varying vec4 color;' +
    'void main() {' +
        'gl_FragColor = color;' +
    '}';
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);


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


    /** unverändert **/
        // Bind vertex buffer to attribute variable
 /*   posAttrib = gl.getAttribLocation(shaderProgram, "pos");
    gl.enableVertexAttribArray(posAttrib);*/

    /** *** **/
}


/**
 *  Setup vertex and index buffer objects for body parts
 */
function initBuffers(model) {

    // Fill the data arrays.
    if(model == "funnel") {
        createVertexDataFunnel();
    } else if(model == "ei") {
        createVertexDataEi();
    } else if(model == "pseudosphere") {
        createVertexDataPseudosphere();
    } else if(model == "test") {
        createVertexDataTest();
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
function render() {

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









function createVertexDataFunnel(){
    /*var m      = 20;
     var n      = 22;*/
    var m      = 18;
    var n      = 15;

    var umin   = 0;
    var umax   = 1.0;
    var vmin   = -3.0;
    var vmax   = 2*Math.PI;

    var du = (umax-umin)/n; // (maxU-minU)/n; // 2*Math.PI/n;
    var dv = (vmax-vmin)/m; // (maxV-minV)/m; // 1/m;

    // Counter for entries in index array.
    var iLines  = 0;
    var iTris   = 0;

    // Positions.
    vertices = new Float32Array(3 * (n+1) * (m+1));
    // Index data.
    indicesLines = new Uint16Array(2 * 2 * n * m);
    indicesTris  = new Uint16Array(3 * 2 * n * m);

    // Loop angle t.
    for(var i = 0, u = 0; i <= n; i++, u += du) {
        // Loop angle v.
        for(var j = 0, v = 0; j <= m; j++, v += dv) {

            var iVertex = i*(m+1) + j;

            var x = 0.5* u * Math.sin(v);
            var y = 0.25* Math.log(u);
            var z = 0.5* u * Math.cos(v);

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;


            // Set index.
            // Line on beam.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - (m+1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if(j>0 && i>0){
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1) - 1;
                indicesTris[iTris++] = iVertex - (m+1);
            }
        }
    }
    console.log("Tris: "  + indicesTris  + " " + indicesTris.length);
    console.log("Lines: " + indicesLines + " " + indicesLines.length);
}

function createVertexDataEi(){
    var n      = 69;
    var m      = 20;

    var umin   = -1;
    var umax   = 2.0;
    var vmin   = 0.0;
    var vmax   = 2*Math.PI;

    // Positions.
    vertices = new Float32Array(3 * (n+1) * (m+1));
    // Index data.
    indicesLines = new Uint16Array(2 * 2 * n * m);
    indicesTris  = new Uint16Array(3 * 2 * n * m);

    var du = (umax-umin)/n; // (maxU-minU)/n; // 2*Math.PI/n;
    var dv = (vmax-vmin)/m; // (maxV-minV)/m; // 1/m;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    var a = 2;
    var b = 1;
    var c = 0.5;

    // Loop angle t.
    for(var i = 0, u = 0; i <= n; i++, u += du) {
        // Loop angle v.
        for(var j = 0, v = 0; j <= m; j++, v += dv) {

            var iVertex = i*(m+1) + j;

            var x = c * Math.sqrt(u * (u - a) * (u - b)) * Math.sin(v);
            var y = u-0.5;
            var z = c * Math.sqrt(u * (u - a) * (u - b)) * Math.cos(v);

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Set index.
            // Line on beam.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - (m+1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if(j>0 && i>0){
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1) - 1;
                indicesTris[iTris++] = iVertex - (m+1);
            }
        }
    }
}

function createVertexDataPseudosphere(){
    var n      = 20;
    var m      = 40;

    var umin   = -Math.PI;
    var umax   = Math.PI;
    var vmin   = 0.1;
    var vmax   = 3.05;

    // Positions.
    vertices = new Float32Array(3 * (n+1) * (m+1));
    // Index data.
    indicesLines = new Uint16Array(2 * 2 * n * m);
    indicesTris  = new Uint16Array(3 * 2 * n * m);

    var du = (umax-umin)/n;
    var dv = (vmax-vmin)/m;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;

    // Loop angle t.
    for(var i = 0, u = 0; i <= n; i++, u += du) {
        // Loop angle v.
        for(var j = 0, v = 0; j <= m; j++, v += dv) {

            var iVertex = i*(m+1) + j;

            var x = Math.cos(u) * Math.sin(v);
            var z = Math.sin(u) * Math.sin(v);
            var y = Math.cos(v) + Math.log(Math.tan(v/2));

            /*var x = 0.25* Math.cos(u) * (2 * Math.cos(2*v) - Math.cos(2 * v));
             var z = 0.25* Math.sin(u) * (2 * Math.cos(v) - Math.cos(2 * v));
             var y = 0.25*Math.sin(v) - Math.sin(1 * v);*/

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Set index.
            // Line on beam.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - (m+1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if(j>0 && i>0){
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1) - 1;
                indicesTris[iTris++] = iVertex - (m+1);
            }
        }
    }
}

function createVertexDataTest(){
    var n      = 60;
    var m      = 60;

    var umin   = -2*Math.PI;
    var umax   = 2*Math.PI;
    var vmin   = -2*Math.PI;
    var vmax   = 2*Math.PI;

    // Positions.
    vertices = new Float32Array(3 * (n+1) * (m+1));
    // Index data.
    indicesLines = new Uint16Array(2 * 2 * n * m);
    indicesTris  = new Uint16Array(3 * 2 * n * m);

    var du = (umax-umin)/n; // (maxU-minU)/n; // 2*Math.PI/n;
    var dv = (vmax-vmin)/m; // (maxV-minV)/m; // 1/m;
    // Counter for entries in index array.
    var iLines = 0;
    var iTris = 0;


    // Loop angle t.
    for(var i = 0, u = 0; i <= n; i++, u += du) {
        // Loop angle v.
        for(var j = 0, v = 0; j <= m; j++, v += dv) {

            var iVertex = i*(m+1) + j;

            var R = .25;
            var r = .125;

            var x = (R + r * Math.cos(v)) * Math.cos(u);
            var z = (R + r * Math.cos(v)) * Math.sin(u);
            var y = r * Math.sin(v);

            /*var x = 0.25* Math.cos(u) * (2 * Math.cos(2*v) - Math.cos(2 * v));
             var z = 0.25* Math.sin(u) * (2 * Math.cos(v) - Math.cos(2 * v));
             var y = 0.25*Math.sin(v) - Math.sin(1 * v);*/

            // Set vertex positions.
            vertices[iVertex * 3] = x;
            vertices[iVertex * 3 + 1] = y;
            vertices[iVertex * 3 + 2] = z;

            // Set index.
            // Line on beam.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - 1;
                indicesLines[iLines++] = iVertex;
            }
            // Line on ring.
            if(j>0 && i>0){
                indicesLines[iLines++] = iVertex - (m+1);
                indicesLines[iLines++] = iVertex;
            }

            // Set index.
            // Two Triangles.
            if(j>0 && i>0){
                indicesTris[iTris++] = iVertex;
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1);
                //
                indicesTris[iTris++] = iVertex - 1;
                indicesTris[iTris++] = iVertex - (m+1) - 1;
                indicesTris[iTris++] = iVertex - (m+1);
            }
        }
    }
}