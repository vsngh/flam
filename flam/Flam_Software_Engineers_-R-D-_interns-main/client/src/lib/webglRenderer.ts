/**
 * WebGL Renderer - Texture rendering with shader effects
 * Equivalent to OpenGL ES 2.0 rendering
 */

import { ShaderEffect } from "@shared/schema";

export class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private currentEffect: ShaderEffect = ShaderEffect.NONE;

  // Shader uniform locations
  private uniformLocations: {
    uSampler?: WebGLUniformLocation | null;
    uEffect?: WebGLUniformLocation | null;
    uBrightness?: WebGLUniformLocation | null;
    uContrast?: WebGLUniformLocation | null;
  } = {};

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      throw new Error('WebGL not supported');
    }
    this.gl = gl as WebGLRenderingContext;
    this.initShaders();
    this.initBuffers();
    this.initTexture();
  }

  private initShaders(): void {
    const vertexShaderSource = `
      attribute vec2 aPosition;
      attribute vec2 aTexCoord;
      varying vec2 vTexCoord;
      
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        vTexCoord = aTexCoord;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 vTexCoord;
      uniform sampler2D uSampler;
      uniform int uEffect;
      uniform float uBrightness;
      uniform float uContrast;
      
      vec3 applyBrightness(vec3 color, float brightness) {
        return color + brightness;
      }
      
      vec3 applyContrast(vec3 color, float contrast) {
        return (color - 0.5) * (1.0 + contrast) + 0.5;
      }
      
      void main() {
        vec4 texColor = texture2D(uSampler, vTexCoord);
        vec3 color = texColor.rgb;
        
        // Apply shader effects
        if (uEffect == 1) { // INVERT
          color = 1.0 - color;
        } else if (uEffect == 2) { // SEPIA
          float r = color.r * 0.393 + color.g * 0.769 + color.b * 0.189;
          float g = color.r * 0.349 + color.g * 0.686 + color.b * 0.168;
          float b = color.r * 0.272 + color.g * 0.534 + color.b * 0.131;
          color = vec3(r, g, b);
        } else if (uEffect == 3) { // BRIGHTNESS
          color = applyBrightness(color, uBrightness);
        } else if (uEffect == 4) { // CONTRAST
          color = applyContrast(color, uContrast);
        }
        
        gl_FragColor = vec4(color, texColor.a);
      }
    `;

    const vertexShader = this.compileShader(vertexShaderSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSource, this.gl.FRAGMENT_SHADER);

    this.program = this.gl.createProgram();
    if (!this.program || !vertexShader || !fragmentShader) {
      throw new Error('Failed to create shader program');
    }

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      throw new Error('Shader program failed to link: ' + this.gl.getProgramInfoLog(this.program));
    }

    this.gl.useProgram(this.program);

    // Get uniform locations
    this.uniformLocations.uSampler = this.gl.getUniformLocation(this.program, 'uSampler');
    this.uniformLocations.uEffect = this.gl.getUniformLocation(this.program, 'uEffect');
    this.uniformLocations.uBrightness = this.gl.getUniformLocation(this.program, 'uBrightness');
    this.uniformLocations.uContrast = this.gl.getUniformLocation(this.program, 'uContrast');
  }

  private compileShader(source: string, type: number): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private initBuffers(): void {
    if (!this.program) return;

    // Vertex positions (2 triangles forming a quad)
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1,
    ]);

    // Texture coordinates
    const texCoords = new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      1, 0,
    ]);

    // Position buffer
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

    const aPosition = this.gl.getAttribLocation(this.program, 'aPosition');
    this.gl.enableVertexAttribArray(aPosition);
    this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);

    // Texture coordinate buffer
    const texCoordBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, texCoords, this.gl.STATIC_DRAW);

    const aTexCoord = this.gl.getAttribLocation(this.program, 'aTexCoord');
    this.gl.enableVertexAttribArray(aTexCoord);
    this.gl.vertexAttribPointer(aTexCoord, 2, this.gl.FLOAT, false, 0, 0);
  }

  private initTexture(): void {
    this.texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    // Set texture parameters
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
  }

  setShaderEffect(effect: ShaderEffect, brightness: number = 0, contrast: number = 0): void {
    this.currentEffect = effect;
    
    if (!this.program) return;
    
    this.gl.useProgram(this.program);
    
    const effectMap: Record<ShaderEffect, number> = {
      [ShaderEffect.NONE]: 0,
      [ShaderEffect.INVERT]: 1,
      [ShaderEffect.SEPIA]: 2,
      [ShaderEffect.BRIGHTNESS]: 3,
      [ShaderEffect.CONTRAST]: 4,
    };

    if (this.uniformLocations.uEffect) {
      this.gl.uniform1i(this.uniformLocations.uEffect, effectMap[effect]);
    }
    
    if (this.uniformLocations.uBrightness) {
      this.gl.uniform1f(this.uniformLocations.uBrightness, brightness / 100);
    }
    
    if (this.uniformLocations.uContrast) {
      this.gl.uniform1f(this.uniformLocations.uContrast, contrast / 100);
    }
  }

  renderFrame(imageData: ImageData): void {
    const { width, height } = imageData;

    // Resize canvas if needed
    if (this.gl.canvas.width !== width || this.gl.canvas.height !== height) {
      this.gl.canvas.width = width;
      this.gl.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }

    // Update texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      imageData
    );

    // Clear and draw
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    if (this.uniformLocations.uSampler) {
      this.gl.uniform1i(this.uniformLocations.uSampler, 0);
    }

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy(): void {
    if (this.texture) {
      this.gl.deleteTexture(this.texture);
    }
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
  }
}
