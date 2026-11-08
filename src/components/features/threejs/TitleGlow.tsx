'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface TitleGlowProps {
  className?: string;
  color?: number;
  intensity?: number;
}

export default function TitleGlow({
  className = '',
  color = 0xffd700, // Gold color
  intensity = 1.5
}: TitleGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const glowRingsRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create glow rings (3D aura effect)
    const glowRings: THREE.Mesh[] = [];
    const ringCount = 3;

    for (let i = 0; i < ringCount; i++) {
      const ringGeometry = new THREE.TorusGeometry(15 + i * 5, 0.3, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.15 - (i * 0.03)
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      glowRings.push(ring);
    }

    glowRingsRef.current = glowRings;

    // Create floating glow particles
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * 25;
      const height = (Math.random() - 0.5) * 10;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = height;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particleSizes[i] = Math.random() * 2 + 0.5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 1,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Add point light for glow effect
    const pointLight = new THREE.PointLight(color, intensity, 100);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Rotate glow rings
      glowRings.forEach((ring, i) => {
        ring.rotation.z = time * (0.2 + i * 0.1);
        ring.rotation.x = Math.PI / 2 + Math.sin(time * 0.5 + i) * 0.1;

        // Pulse effect
        const scale = 1 + Math.sin(time * 2 + i) * 0.05;
        ring.scale.set(scale, scale, scale);
      });

      // Animate particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const angle = Math.atan2(positions[i * 3 + 2], positions[i * 3]);
          const radius = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2);

          // Orbit around center
          const newAngle = angle + 0.002;
          positions[i * 3] = Math.cos(newAngle) * radius;
          positions[i * 3 + 2] = Math.sin(newAngle) * radius;

          // Vertical oscillation
          positions[i * 3 + 1] += Math.sin(time * 2 + i) * 0.02;
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.rotation.y = time * 0.1;
      }

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.5) * 2;
      camera.position.y = Math.cos(time * 0.3) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Clean up Three.js resources
      glowRings.forEach(ring => {
        scene.remove(ring);
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });

      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        (particlesRef.current.material as THREE.Material).dispose();
      }

      scene.remove(pointLight);
      scene.remove(ambientLight);

      if (renderer) {
        renderer.dispose();
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [color, intensity]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
