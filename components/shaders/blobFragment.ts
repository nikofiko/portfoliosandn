export const blobFragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main(){
    // ── Base palette ────────────────────────────────────────────────
    // colorA matches the hero's dark panel (#0C0C0F) — feels native to the design
    // colorB matches --violet (#7C3AED) — already in the site's palette
    // colorC matches --cyan  (#0891B2) — site's cyan accent, teal transition on scroll
    vec3 colorA = vec3(0.05, 0.03, 0.14);  // deep indigo-black  #0d0824
    vec3 colorB = vec3(0.48, 0.23, 0.93);  // vivid violet       #7a3bed  ≈ --violet
    vec3 colorC = vec3(0.03, 0.57, 0.70);  // site cyan          #0991b3  ≈ --cyan

    // Smooth low-frequency colour gradient
    float n1 = sin(vWorldPos.x * 0.9 + uTime * 0.25) * 0.5 + 0.5;
    float n2 = sin(vWorldPos.y * 1.1 + uTime * 0.20) * 0.5 + 0.5;
    float n  = mix(n1, n2, 0.45);

    vec3 base = mix(colorA, colorB, n);
    // Scroll pushes toward --cyan (matches the site's teal section palette)
    base = mix(base, colorC, uScrollProgress * uScrollProgress * 0.55);

    // ── Fresnel ──────────────────────────────────────────────────────
    vec3  viewDir = normalize(cameraPosition - vWorldPos);
    float cosTheta = max(dot(vNormal, viewDir), 0.0);
    float fresnel  = pow(1.0 - cosTheta, 2.2);

    // Inner rim: warm cream-white — matches hero-left background (#F8F7F4)
    // so the blob edge feels like it belongs against the cream panel
    vec3 rimWarm  = vec3(1.0, 0.97, 0.90);
    vec3 final    = mix(base, rimWarm, fresnel * 0.72);

    // Outer accent rim: thin orange halo at extreme silhouette angles
    // Directly references --accent: #FF4D00 — ties the blob to the site's
    // primary colour without overwhelming the violet body
    vec3  accentOrange = vec3(1.0, 0.30, 0.00); // #FF4D00
    float accentRim    = pow(1.0 - cosTheta, 6.0); // only at very glancing angle
    final = mix(final, accentOrange, accentRim * 0.55);

    // Soft inner pulse — single slow wave, barely visible
    float pulse = sin(length(vWorldPos) * 1.8 - uTime * 1.2) * 0.5 + 0.5;
    pulse       = smoothstep(0.90, 1.0, pulse) * 0.14;
    final      += pulse * vec3(0.45, 0.20, 0.90);

    float alpha = uOpacity * mix(0.72, 1.0, fresnel);
    gl_FragColor = vec4(final, alpha);
  }
`;
