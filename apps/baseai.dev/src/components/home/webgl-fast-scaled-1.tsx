'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WebGLInitializer = () => {
	const mountRef = useRef<HTMLDivElement | null>(null);
	const [mousePosition, setMousePosition] = useState<THREE.Vector2>(
		new THREE.Vector2(0, 0)
	);

	useEffect(() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		if (mountRef.current) {
			mountRef.current.appendChild(renderer.domElement);
		}

		// Create a background texture with sharper text
		const createBackgroundTexture = (width: number, height: number) => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			// Increase canvas size for higher resolution
			const scale = 2; // You can adjust this value for even higher resolution
			canvas.width = width * scale;
			canvas.height = height * scale;

			if (ctx) {
				ctx.scale(scale, scale); // Scale the context to match the increased canvas size
				ctx.fillStyle = '#000000';
				ctx.fillRect(0, 0, width, height);

				// Calculate font size based on screen dimensions
				const baseFontSize = width * 0.19; // 18.5% of the smaller dimension
				ctx.font = `bold ${baseFontSize}px Grotesk`;

				ctx.fillStyle = '#ffffff';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';

				// Use crisp edges for text rendering
				ctx.imageSmoothingEnabled = false;

				// Draw the text
				ctx.fillText('BASE AI', width / 2, height / 2);
			}

			const bgTexture = new THREE.CanvasTexture(canvas);
			bgTexture.minFilter = THREE.LinearFilter;
			bgTexture.magFilter = THREE.LinearFilter;
			bgTexture.wrapS = THREE.RepeatWrapping;
			bgTexture.wrapT = THREE.RepeatWrapping;
			return bgTexture;
		};

		// Initial background texture creation
		let bgTexture = createBackgroundTexture(
			window.innerWidth,
			window.innerHeight
		);
		scene.background = bgTexture;

		// Create a sphere geometry
		const geometry = new THREE.SphereGeometry(0.75, 256, 256);

		const textureLoader = new THREE.TextureLoader();
		const envMapSize = Math.max(window.innerWidth, window.innerHeight) * 2;
		const envMap = textureLoader.load(
			'./panoenv3.jpg',
			undefined,
			undefined,
			() => {
				envMap.mapping = THREE.EquirectangularReflectionMapping;
				envMap.colorSpace = THREE.SRGBColorSpace;
				envMap.repeat.set(envMapSize / 2048, envMapSize / 1024);
				envMap.wrapS = THREE.RepeatWrapping;
				envMap.wrapT = THREE.RepeatWrapping;
			}
		);

		// Custom shader material for the enhanced liquid wavy effect
		const material = new THREE.ShaderMaterial({
			transparent: true,
			uniforms: {
				u_time: { value: 0.0 },
				u_resolution: {
					value: new THREE.Vector2(
						window.innerWidth,
						window.innerHeight
					)
				},
				u_background: { value: bgTexture },
				u_viewVector: { value: camera.position },
				envMap: { value: envMap },
				roughness: { value: 0.0 },
				metalness: { value: 5 },
				color: { value: new THREE.Color(0x3366ff) },
				u_mouse: { value: new THREE.Vector3() }
			},
			vertexShader: `
    precision mediump float;

    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec2 vUv;
    uniform float u_time;
	uniform vec3 u_mouse;
	#define M_PI 3.14159265358979323846

    // Simplex 3D Noise function
    vec4 permute(vec4 x) {
        return mod(((x*34.0)+1.0)*x, 289.0);
    }
    vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
    }
    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1. + 3.0 * C.xxx;
        i = mod(i, 289.0 );
        vec4 p = permute( permute( permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 1.0/7.0;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      // Enhanced waves using simplex noise
      float noise = snoise(vec3(position * 3.0 + u_time * .35)); // Doubled speed
      vec3 newPos = position + normal * noise * 0.05; // Increased displacement
      vNormal = normalize(normalMatrix * (normal + vec3(noise * 0.5))); // Increased normal perturbation
      vWorldPos = (modelMatrix * vec4(newPos, 1.0)).xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(vWorldPos, 1.0);
    }
  `,
			fragmentShader: `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform sampler2D u_background;
    uniform vec3 u_viewVector;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    uniform vec3 color;
    varying vec2 vUv;
    uniform float roughness;
    uniform float metalness;
    uniform sampler2D envMap;

    vec2 dirToEquirectangular(vec3 dir) {
        float phi = atan(dir.z, dir.x);
        float theta = acos(dir.y);
        return vec2(0.5 + phi / (2.0 * 3.1415926535), theta / 3.1415926535);
    }

    vec2 dirToOctahedralMapping(vec3 dir) {
        dir = normalize(dir);
        vec2 octahedralDir = dir.xy / (abs(dir.x) + abs(dir.y) + abs(dir.z));
        if (dir.z < 0.0) {
            octahedralDir = (1.0 - abs(octahedralDir.yx)) * sign(octahedralDir.xy);
        }
        return octahedralDir * 0.5 + 0.5;
    }

    void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(u_viewVector - vWorldPos);

        // Refraction effect without noise
        float ior = 1.33;
        vec3 refracted = refract(-viewDir, normal, 1.0 / ior);

        // Reflection calculations
        vec3 reflection = reflect(-viewDir, normal);

        // Calculate UV coordinates for sampling the background
        vec2 uv = gl_FragCoord.xy / u_resolution;

        // Distort the UV based on the refraction without noise
        float distortionStrength = 0.05;
        uv += refracted.xy * distortionStrength;

        // Sample the background texture for refraction
        vec4 refractedColor = texture2D(u_background, uv);

        // Fresnel effect for edge highlighting and reflection
        float fresnelBase = 2.0 - dot(viewDir, normal);
        float fresnel = pow(fresnelBase, 1.0);

        // Calculate distance from the center of the sphere
        vec2 centeredPos = vec2(vWorldPos.x / 2.0, vWorldPos.y) - vec2(0.0, 0.0);
        float distanceFromCenter = length(centeredPos);

        // Adjust reflection strength based on distance from center
        float reflectionStrength = smoothstep(0.0, 0.5, distanceFromCenter);

        // Sample reflection color from both the background and envMap
        vec2 reflectedUV = reflection.xy * 2.0 * reflectionStrength;

        // Use the scaled reflection to compute envMap UV coordinates
        vec2 reflectEnvCoord = dirToOctahedralMapping(reflection);
        vec4 envMapReflection = texture2D(envMap, vec2(reflectEnvCoord.x,reflectEnvCoord.y));
        vec4 backgroundReflection = texture2D(u_background, reflectedUV);

        // Blend the two reflection colors
        vec4 reflectedColor = mix(backgroundReflection, envMapReflection, 0.9);

        // Sharpen and boost the reflection for more liquid-like appearance
        reflectedColor.rgb *= 1.5 * reflectionStrength;

        // Combine refraction and reflection based on Fresnel effect and distance from center
        vec3 finalColor = mix(refractedColor.rgb, reflectedColor.rgb, fresnel * 0.3 * reflectionStrength);

        // Directional edge lighting effect
        vec3 lightDir = normalize(vec3(-1.0, -1.0, 1.0));
        float directionalEdgeStrength = max(dot(normal, lightDir), 0.0) * 0.5;

        // Full edge effect
        float edgeStrength = 1.0 - smoothstep(-1.0, 0.1, dot(normal, viewDir));
        float randomEdge = fract(sin(dot(vWorldPos.xy, vec2(12.9898, 78.233))) * 43758.5453);
        vec3 fullEdgeColor = vec3(1.0) * edgeStrength * randomEdge * 0.25;

        // Combine directional and full edge effects
        vec3 edgeColor = fullEdgeColor;

        // Add the edge color to the final color
        finalColor += edgeColor;

        // Simple PBR lighting with enhanced purple specular
        float NdotL = max(dot(normal, lightDir), 0.0);
        vec3 H = normalize(lightDir + viewDir);
        float NdotH = max(dot(normal, H), 0.0);

        // Increase the specular power for a tighter, more visible highlight
        float specPower = 90.0;
        float spec = pow(NdotH, specPower);

        // Define a strong purple color for the specular highlight
        vec3 purpleSpec = vec3(0.1, 0.02, 0.3); // Bright purple

        // Increase the intensity of the specular highlight
        float specIntensity = 2.;

        // Add the purple specular highlight to the final color
        finalColor += purpleSpec * spec * specIntensity * NdotL;

        // Water drop-like dark shadow effect
        vec3 shadowDir = normalize(vec3(0.5, -1.0, 0.5)); // Adjust direction as needed
        float shadowStrength = max(0.0, dot(normal, shadowDir));
        vec3 shadowColor = vec3(0.0, 0.0, 0.1); // Dark blue shadow
        finalColor = mix(finalColor, shadowColor, shadowStrength * 0.5);

        // Adjust alpha based on distance from center (if needed)
        float alpha = 1.0;
        if (dot(normal, viewDir) < 0.0) {
            // Backside of the sphere
            alpha = 1.0; // Make the backside the same as the front
        }

        // Output the final color with alpha
        gl_FragColor = vec4(finalColor, alpha);
    }
  `
		});
		// Create a mesh with the geometry and material
		const sphere = new THREE.Mesh(geometry, material);
		scene.add(sphere);

		sphere.rotateZ(3);

		function calculateCameraZ(screenWidth: number, screenHeight: number) {
			let cameraZ;

			// Breakpoints based on screen width and height
			if (screenWidth <= 768) {
				if (screen.availWidth < screen.availHeight) {
					cameraZ = 4.5;
				} else {
					cameraZ = 3;
				}
			} else if (screenWidth > 768 && screenWidth <= 1920) {
				if (screenHeight <= 1080) {
					cameraZ = 2; // Full HD screens (1920x1080)
				} else {
					cameraZ = 1.9; // Higher aspect ratio or larger height
				}
			} else if (screenWidth > 1920 && screenWidth <= 2440) {
				if (screenHeight <= 1080) {
					cameraZ = 1.75; // Wide screens with Full HD height
				} else {
					cameraZ = 1.65; // Taller screens with higher resolutions
				}
			} else if (screenWidth > 2440) {
				if (screenHeight <= 1440) {
					cameraZ = 1.5; // Ultra-wide or larger 2K displays
				} else {
					cameraZ = 1.4; // 4K and above
				}
			}

			return cameraZ;
		}

		// Get screen width and height
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		// Calculate camera Z position based on breakpoints
		const cameraZ = calculateCameraZ(screenWidth, screenHeight);
		if (cameraZ) camera.position.z = cameraZ;

		// Raycaster setup
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();

		// Mouse move event handler
		const onMouseMove = (event: MouseEvent) => {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			setMousePosition(new THREE.Vector2(mouse.x, mouse.y));
		};

		window.addEventListener('mousemove', onMouseMove);

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);
			material.uniforms.u_time.value += 0.02; // Update time for animation (doubled speed)
			material.uniforms.u_viewVector.value = camera.position;
			// sphere.rotation.y += 0.004; // Doubled rotation speed

			// Update mouse position in the shader
			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObject(sphere);
			if (intersects.length > 0) {
				material.uniforms.u_mouse.value = intersects[0].point;
			}

			renderer.render(scene, camera);
		};

		animate();

		const updateCameraPosition = () => {
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;
			const cameraZ = calculateCameraZ(screenWidth, screenHeight);
			if (cameraZ) camera.position.z = cameraZ;
		};

		updateCameraPosition();

		const onWindowResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;

			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);

			if (material.uniforms) {
				material.uniforms.u_resolution.value.set(width, height);
			}

			updateCameraPosition();

			// Update background texture with new dimensions
			bgTexture = createBackgroundTexture(width, height);
			scene.background = bgTexture;

			if (material.uniforms && material.uniforms.u_background) {
				material.uniforms.u_background.value = bgTexture;
			}
		};

		window.addEventListener('resize', onWindowResize);

		return () => {
			window.removeEventListener('resize', onWindowResize);
			window.removeEventListener('mousemove', onMouseMove);
			if (mountRef.current) {
				mountRef.current.removeChild(renderer.domElement);
			}
		};
	}, []);

	return <div ref={mountRef} />;
};

export default WebGLInitializer;
