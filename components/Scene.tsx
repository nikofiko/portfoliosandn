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

export default function Scene() {
  const blobRef   = useRef<THREE.Mesh>(null);
  const mouseLerp = useRef(new THREE.Vector2());
  const { camera } = useThree();

  const isMobile = useMemo(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
    []
  );

  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uScrollProgress: { value: 0 },
    uMouse:          { value: new THREE.Vector2(0, 0) },
    uOpacity:        { value: 1.0 },
  }), []);

  const anim = useRef({
    blobScale:   1.8,
    blobX:       -0.6,
    blobY:       0,
    blobOpacity: 1,
    camZ:        5,
  });

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

    // Hero → blob drifts upper-right, shrinks
    tl.to(a, { blobScale: 0.9, blobX: 1.8, blobY: 1.2, camZ: 6.5, duration: 0.20 }, 0.05)
    // Mid scroll — swings to lower-left
      .to(a, { blobX: -1.5, blobY: -0.8, blobScale: 0.7,             duration: 0.20 }, 0.28)
    // Portfolio area — slides to right, gets smaller
      .to(a, { blobX: 1.0,  blobY: 0.5,  blobScale: 0.6, camZ: 7,   duration: 0.20 }, 0.48)
    // Testimonials — blob sweeps back IN FRONT, large
      .to(a, { blobX: 0.2,  blobY: 0.1,  blobScale: 1.4, blobOpacity: 1, camZ: 5, duration: 0.12 }, 0.62)
    // Testimonials end — exits left
      .to(a, { blobX: -2.2, blobOpacity: 0,                            duration: 0.10 }, 0.76)
    // Contact — blob reforms at centre
      .to(a, { blobScale: 1.8, blobX: 0, blobY: 0, blobOpacity: 1, camZ: 5, duration: 0.15 }, 0.87);

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

    const t = clock.elapsedTime;
    const a = anim.current;

    mouseLerp.current.x = THREE.MathUtils.lerp(mouseLerp.current.x, scrollStore.mouseX, 0.06);
    mouseLerp.current.y = THREE.MathUtils.lerp(mouseLerp.current.y, scrollStore.mouseY, 0.06);
    const mx = mouseLerp.current.x;
    const my = mouseLerp.current.y;

    uniforms.uTime.value           = t;
    uniforms.uScrollProgress.value = scrollStore.progress;
    uniforms.uMouse.value.set(mx, my);
    uniforms.uOpacity.value        = a.blobOpacity;

    if (blobRef.current) {
      blobRef.current.rotation.x = t * 0.12 + my * 0.45;
      blobRef.current.rotation.y = t * 0.18 + mx * 0.45;
      blobRef.current.rotation.z = Math.sin(t * 0.08) * 0.1;
      const floatX = Math.sin(t * 0.35) * 0.22;
      const floatY = Math.cos(t * 0.28) * 0.15;
      blobRef.current.scale.setScalar(a.blobScale);
      blobRef.current.position.x = a.blobX + mx * 0.3 + floatX;
      blobRef.current.position.y = a.blobY + my * 0.2 + floatY;
    }

    // Gentle camera pan with mouse, mild scroll Z
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx * 0.8, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, my * 0.5, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, a.camZ,   0.04);
    camera.lookAt(0, 0, 0);
  });

  // ── JSX ──────────────────────────────────────────────────────────
  return (
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
  );
}
