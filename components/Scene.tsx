'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { blobVertexShader } from './shaders/blobVertex';
import { blobFragmentShader } from './shaders/blobFragment';
import { scrollStore } from '../store/scrollStore';

gsap.registerPlugin(ScrollTrigger);

// ── Static orb definitions (module-level, never reallocated) ──────────
const ORB_DATA: { pos: [number, number, number]; color: string; size: number }[] = [
  // Colours pulled from site palette: --violet, --accent (orange), --cyan, --indigo
  { pos: [-3.8,  1.6, -2.0], color: '#7c3aed', size: 0.10 }, // violet
  { pos: [ 3.4, -0.9, -3.2], color: '#FF4D00', size: 0.08 }, // orange accent
  { pos: [-2.2, -2.8, -1.8], color: '#4f46e5', size: 0.12 }, // indigo
  { pos: [ 4.2,  2.0, -4.0], color: '#0891b2', size: 0.09 }, // cyan
  { pos: [-4.2,  0.4, -3.6], color: '#a78bfa', size: 0.07 }, // violet-light
  { pos: [ 2.0,  3.2, -2.8], color: '#FF4D00', size: 0.11 }, // orange accent
  { pos: [ 2.8, -3.2, -2.4], color: '#7c3aed', size: 0.08 }, // violet
  { pos: [-1.4,  3.0, -4.2], color: '#4f46e5', size: 0.10 }, // indigo
];

export default function Scene() {
  // ── Refs ──────────────────────────────────────────────────────────
  const blobRef  = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const orbsRef  = useRef<THREE.Group>(null);
  const ptRef    = useRef<THREE.Points | null>(null);
  const geomRef  = useRef<THREE.BufferGeometry | null>(null);
  const mouseLerp = useRef(new THREE.Vector2());
  const ptColor   = useRef(new THREE.Color('#7c3aed'));

  const { camera, scene } = useThree();

  // ── Device ────────────────────────────────────────────────────────
  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );
  const COUNT = isMobile ? 2000 : 5000;

  // ── Shader uniforms ───────────────────────────────────────────────
  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uScrollProgress: { value: 0 },
    uMouse:          { value: new THREE.Vector2(0, 0) },
    uOpacity:        { value: 1.0 },
  }), []);

  // ── Particle formations ───────────────────────────────────────────
  const { cloudPos, ribbonPos, vortexPos, scatterPos } = useMemo(() => {
    const cloud   = new Float32Array(COUNT * 3);
    const ribbon  = new Float32Array(COUNT * 3);
    const vortex  = new Float32Array(COUNT * 3);
    const scatter = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      // Cloud — tighter sphere so particles overlap → soft glow cluster
      const θc = Math.random() * Math.PI * 2;
      const φc = Math.acos(2 * Math.random() - 1);
      // Bias toward inner shell with sqrt so density increases near centre
      const rc = 1.8 + Math.sqrt(Math.random()) * 2.0;
      cloud[i*3]     = rc * Math.sin(φc) * Math.cos(θc);
      cloud[i*3 + 1] = rc * Math.sin(φc) * Math.sin(θc);
      cloud[i*3 + 2] = rc * Math.cos(φc) - 0.5;

      // Ribbon — wide flat plane, thin vertically
      ribbon[i*3]     = (Math.random() - 0.5) * 18;
      ribbon[i*3 + 1] = (Math.random() - 0.5) * 0.5;
      ribbon[i*3 + 2] = (Math.random() - 0.5) * 4 - 1;

      // Vortex — expanding helix (galaxy-arm feel)
      const frac  = i / COUNT;
      const turns = 7;
      const ang   = frac * Math.PI * 2 * turns;
      const rv    = 0.4 + frac * 4;
      const hv    = (frac - 0.5) * 10;
      vortex[i*3]     = rv * Math.cos(ang);
      vortex[i*3 + 1] = hv;
      vortex[i*3 + 2] = rv * Math.sin(ang) - 1;

      // Scatter — very wide sphere
      const θs = Math.random() * Math.PI * 2;
      const φs = Math.acos(2 * Math.random() - 1);
      const rs = 6 + Math.random() * 7;
      scatter[i*3]     = rs * Math.sin(φs) * Math.cos(θs);
      scatter[i*3 + 1] = rs * Math.sin(φs) * Math.sin(θs);
      scatter[i*3 + 2] = rs * Math.cos(φs) - 1;
    }

    return { cloudPos: cloud, ribbonPos: ribbon, vortexPos: vortex, scatterPos: scatter };
  }, [COUNT]);

  const curPos = useRef(new Float32Array(COUNT * 3));

  // ── GSAP-driven animation values ──────────────────────────────────
  const anim = useRef({
    // Blob
    blobScale:   1.8,   // hero: massive
    blobX:       0,
    blobY:       0,
    blobOpacity: 1,
    // Rings
    ring1Scale:  0.01,  ring1Opacity: 0,
    ring2Scale:  0.01,  ring2Opacity: 0,
    ring3Scale:  0.01,  ring3Opacity: 0,
    // Particles
    ptOpacity: 0,
    ptSize:    isMobile ? 0.025 : 0.02,
    // Camera
    camX: 0, camY: 0, camZ: 3.5,
  });

  // ── Particle system (imperative) ──────────────────────────────────
  useEffect(() => {
    curPos.current.set(cloudPos);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(curPos.current, 3));

    const mat = new THREE.PointsMaterial({
      // Larger points so they overlap and blur together visually
      size:            isMobile ? 0.055 : 0.042,
      color:           new THREE.Color('#7c3aed'),
      transparent:     true,
      opacity:         0,
      sizeAttenuation: true,
      depthWrite:      false,
      // Additive blending: where particles overlap they brighten,
      // creating a soft glowing nebula rather than sharp dots
      blending:        THREE.AdditiveBlending,
    });

    const pts = new THREE.Points(geom, mat);
    scene.add(pts);
    ptRef.current   = pts;
    geomRef.current = geom;

    return () => { scene.remove(pts); geom.dispose(); mat.dispose(); };
  }, [scene, cloudPos, isMobile]);

  // ── GSAP scroll timeline ──────────────────────────────────────────
  useEffect(() => {
    const a = anim.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        start:    0,
        end:      'max',
        scrub:    1.2,
        onUpdate: (self) => { scrollStore.progress = self.progress; },
      },
    });

    // 0.00–0.05  Hero resting — no anim
    // 0.05–0.22  Hero scroll → blob shrinks, camera pulls back
    tl.to(a, { blobScale: 0.55, blobY: 2.8, camZ: 6.5, duration: 0.17 }, 0.05)
    // 0.14–0.28  Ring 1 sweeps in (large outer ring)
      .to(a, { ring1Scale: 1.8, ring1Opacity: 0.9, duration: 0.14 }, 0.14)
    // 0.20–0.32  Ring 2 appears (tilted inner ring)
      .to(a, { ring2Scale: 1.3, ring2Opacity: 0.7, duration: 0.12 }, 0.20)
    // 0.22–0.34  Camera sweeps left, blob fades
      .to(a, { camX: -2, blobOpacity: 0, duration: 0.12 }, 0.22)
    // 0.28–0.42  Particles surge in (cloud phase)
      .to(a, { ptOpacity: 1.0, duration: 0.14 }, 0.28)
    // 0.36–0.52  Services — camera blasts far back, ring 3 appears
      .to(a, { camX: 0, camZ: 11, ring3Scale: 2.5, ring3Opacity: 0.6, duration: 0.16 }, 0.36)
    // 0.50–0.66  Portfolio — camera rockets FORWARD (tunnel), rings shrink
      .to(a, { camZ: 1.6, camY: -1.2, ring1Scale: 0.4, ring2Scale: 0.25, duration: 0.16 }, 0.50)
    // 0.64–0.74  Testimonials — camera stabilises, ring 3 fades
      .to(a, { camZ: 5, camY: 0.8, ring3Opacity: 0, duration: 0.10 }, 0.64)
    // 0.72–0.82  Pricing/About — all rings fade, camera centres
      .to(a, { ring1Opacity: 0, ring2Opacity: 0, ring3Scale: 0.01, camY: 0, duration: 0.10 }, 0.72)
    // 0.85–1.00  Contact — blob dramatically reforms, everything collapses
      .to(a, {
        blobScale: 1.8, blobY: 0, blobOpacity: 1,
        ptOpacity: 0,
        camX: 0, camY: 0, camZ: 3.5,
        duration: 0.15,
      }, 0.85);

    return () => { tl.kill(); };
  }, []);

  // ── Mouse tracking ────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      scrollStore.mouseX = (e.clientX / window.innerWidth)  *  2 - 1;
      scrollStore.mouseY = (e.clientY / window.innerHeight) * -2 + 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // ── Per-frame update ──────────────────────────────────────────────
  useFrame(({ clock }) => {
    if (document.hidden) return;

    const t  = clock.elapsedTime;
    const p  = scrollStore.progress;
    const a  = anim.current;

    // Lerp mouse
    mouseLerp.current.x = THREE.MathUtils.lerp(mouseLerp.current.x, scrollStore.mouseX, 0.06);
    mouseLerp.current.y = THREE.MathUtils.lerp(mouseLerp.current.y, scrollStore.mouseY, 0.06);
    const mx = mouseLerp.current.x;
    const my = mouseLerp.current.y;

    // Uniforms
    uniforms.uTime.value           = t;
    uniforms.uScrollProgress.value = p;
    uniforms.uMouse.value.set(mx, my);
    uniforms.uOpacity.value        = a.blobOpacity;

    // ── Blob ──────────────────────────────────────────────────────
    if (blobRef.current) {
      // Slow spin + stronger mouse tilt
      blobRef.current.rotation.x = t * 0.12 + my * 0.45;
      blobRef.current.rotation.y = t * 0.18 + mx * 0.45;
      blobRef.current.rotation.z = Math.sin(t * 0.08) * 0.1;
      blobRef.current.scale.setScalar(a.blobScale);
      blobRef.current.position.x = a.blobX + mx * 0.3;
      blobRef.current.position.y = a.blobY + my * 0.2;
    }

    // ── Ring 1 — large horizontal, tilts with mouse ───────────────
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.10 + my * 0.5 + Math.PI * 0.15;
      ring1Ref.current.rotation.z = t * 0.06;
      ring1Ref.current.position.y = Math.sin(t * 0.22) * 0.4;
      ring1Ref.current.scale.setScalar(a.ring1Scale);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = a.ring1Opacity;
    }

    // ── Ring 2 — tilted orbital, faster spin ──────────────────────
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.22 + mx * 0.4;
      ring2Ref.current.rotation.x = Math.PI * 0.42 + t * 0.09;
      ring2Ref.current.position.x = Math.cos(t * 0.14) * 0.6;
      ring2Ref.current.scale.setScalar(a.ring2Scale);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = a.ring2Opacity;
    }

    // ── Ring 3 — wide background halo ────────────────────────────
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.05 + Math.PI * 0.5;
      ring3Ref.current.rotation.z = t * 0.04 + mx * 0.2;
      ring3Ref.current.scale.setScalar(a.ring3Scale);
      (ring3Ref.current.material as THREE.MeshBasicMaterial).opacity = a.ring3Opacity;
    }

    // ── Orbs — each drifts independently ─────────────────────────
    if (orbsRef.current) {
      orbsRef.current.rotation.y = t * 0.09;
      orbsRef.current.position.x = mx * 0.35;
      orbsRef.current.position.y = my * 0.25;
      ORB_DATA.forEach((orb, i) => {
        const child = orbsRef.current!.children[i];
        if (!child) return;
        child.position.x = orb.pos[0] + Math.cos(t * 0.28 + i * 1.1) * 0.4;
        child.position.y = orb.pos[1] + Math.sin(t * 0.38 + i * 0.9) * 0.3;
        child.position.z = orb.pos[2] + Math.sin(t * 0.22 + i * 0.7) * 0.25;
      });
    }

    // ── Camera — XYZ travel + mouse pan ──────────────────────────
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, a.camX + mx * 1.4, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, a.camY + my * 0.9, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, a.camZ, 0.04);
    camera.lookAt(0, 0, 0);

    // ── Particles ────────────────────────────────────────────────
    const geom = geomRef.current;
    const pts  = ptRef.current;
    if (!geom || !pts) return;

    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const cur     = curPos.current;

    if (p < 0.34) {
      // Cloud — breathing + slow orbit sway
      const breathe = t * 0.45;
      for (let i = 0; i < COUNT; i++) {
        const ix = i*3, iy = ix+1, iz = ix+2;
        cur[ix] += (cloudPos[ix] - cur[ix]) * 0.014;
        cur[iy] += (cloudPos[iy] - cur[iy]) * 0.014;
        cur[iy] += Math.sin(breathe + i * 0.14) * 0.005;
        cur[ix] += Math.cos(breathe * 0.7 + i * 0.11) * 0.003;
        cur[iz] += (cloudPos[iz] - cur[iz]) * 0.014;
      }
    } else if (p < 0.52) {
      // Ribbon — fast snap
      for (let i = 0; i < COUNT * 3; i++) {
        cur[i] += (ribbonPos[i] - cur[i]) * 0.028;
      }
    } else if (p < 0.70) {
      // Vortex — helix / galaxy arm
      for (let i = 0; i < COUNT * 3; i++) {
        cur[i] += (vortexPos[i] - cur[i]) * 0.020;
      }
    } else if (p < 0.84) {
      // Scatter — explode outward
      for (let i = 0; i < COUNT * 3; i++) {
        cur[i] += (scatterPos[i] - cur[i]) * 0.015;
      }
    } else {
      // Collapse — rush back to cloud
      for (let i = 0; i < COUNT * 3; i++) {
        cur[i] += (cloudPos[i] - cur[i]) * 0.030;
      }
    }

    posAttr.array.set(cur);
    posAttr.needsUpdate = true;

    // Particle material
    const mat = pts.material as THREE.PointsMaterial;
    mat.opacity = a.ptOpacity;

    // Colours pulled from the site palette so particles feel native
    if      (p < 0.34) ptColor.current.set('#7c3aed'); // --violet    (cloud)
    else if (p < 0.52) ptColor.current.set('#FF4D00'); // --accent    (ribbon) — orange flash
    else if (p < 0.70) ptColor.current.set('#a78bfa'); // --violet-light (vortex)
    else if (p < 0.84) ptColor.current.set('#0891b2'); // --cyan      (scatter)
    else               ptColor.current.set('#7c3aed'); // --violet    (collapse back)
    mat.color.lerp(ptColor.current, 0.03);
  });

  // ── JSX ──────────────────────────────────────────────────────────
  return (
    <>
      {/* Main blob — shifted left to sit over the cream hero panel */}
      <mesh ref={blobRef} position={[-0.6, 0, 0]}>
        <sphereGeometry args={[2, isMobile ? 48 : 128, isMobile ? 48 : 128]} />
        <shaderMaterial
          vertexShader={blobVertexShader}
          fragmentShader={blobFragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ring 1 — violet, matches --violet palette */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.8, 0.025, 8, 120]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Ring 2 — orange accent, references --accent #FF4D00 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.1, 0.018, 8, 100]} />
        <meshBasicMaterial color="#FF4D00" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Ring 3 — indigo, matches --indigo palette */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4.5, 0.015, 8, 160]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Floating orbs — scattered in 3-D space */}
      <group ref={orbsRef}>
        {ORB_DATA.map((orb, i) => (
          <mesh key={i} position={orb.pos}>
            <sphereGeometry args={[orb.size, 10, 10]} />
            <meshBasicMaterial color={orb.color} transparent opacity={0.75} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </>
  );
}
