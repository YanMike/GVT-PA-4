var createVertex = (function() {

    function vertexFunnel(model){
        var m      = model[0];
        var n      = model[1];

        var umin   = model[2];
        var umax   = model[3];
        var vmin   = model[4];
        var vmax   = model[5];

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
                    // Line on ring.
                    indicesLines[iLines++] = iVertex - (m+1);
                    indicesLines[iLines++] = iVertex;
                    // Set index.
                    // Two Triangles.
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



    function vertexEgg(model){
        var m      = model[0];
        var n      = model[1];

        var umin   = model[2];
        var umax   = model[3];
        var vmin   = model[4];
        var vmax   = model[5];

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
                    // Line on ring.
                    indicesLines[iLines++] = iVertex - (m+1);
                    indicesLines[iLines++] = iVertex;
                    // Set index.
                    // Two Triangles.
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

    function vertexTorus(model){
        var m      = model[0];
        var n      = model[1];

        var umin   = model[2];
        var umax   = model[3];
        var vmin   = model[4];
        var vmax   = model[5];

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

                var z = (R + r * Math.cos(v)) * Math.cos(u);
                var x = (R + r * Math.cos(v)) * Math.sin(u);
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
                    // Line on ring.
                    indicesLines[iLines++] = iVertex - (m+1);
                    indicesLines[iLines++] = iVertex;
                    // Set index.
                    // Two Triangles.
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

    function vertexPseudosphere(model){
        var m      = model[0];
        var n      = model[1];

        var umin   = model[2];
        var umax   = model[3];
        var vmin   = model[4];
        var vmax   = model[5];

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
                    // Line on ring.
                    indicesLines[iLines++] = iVertex - (m+1);
                    indicesLines[iLines++] = iVertex;
                    // Set index.
                    // Two Triangles.
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

    // Interface
    return {
        vertexFunnel:vertexFunnel,
        vertexEgg:vertexEgg,
        vertexTorus:vertexTorus,
        vertexPseudosphere:vertexPseudosphere
    };

}());




