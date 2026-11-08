'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BlockchainMeshProps {
  className?: string;
  nodeCount?: number;
  connectionDistance?: number;
}

export default function BlockchainMesh({
  className = '',
  nodeCount = 50,
  connectionDistance = 150
}: BlockchainMeshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

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
    camera.position.z = 300;
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

    // Create nodes (blockchain validators)
    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.SphereGeometry(2, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700, // Gold color
      transparent: true,
      opacity: 0.8
    });

    const positions: number[] = [];
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      node.position.x = (Math.random() - 0.5) * 400;
      node.position.y = (Math.random() - 0.5) * 400;
      node.position.z = (Math.random() - 0.5) * 400;
      scene.add(node);
      nodes.push(node);

      positions.push(node.position.x, node.position.y, node.position.z);
      velocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2
      });
    }

    nodesRef.current = nodes;

    // Create connections (lines between nodes)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.15
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(nodeCount * nodeCount * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    linesRef.current = lines;

    // Add ambient particles for "colony" effect
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 500;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 500;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 500;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffa500,
      size: 1,
      transparent: true,
      opacity: 0.4
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      // Update node positions
      nodes.forEach((node, i) => {
        node.position.x += velocities[i].x;
        node.position.y += velocities[i].y;
        node.position.z += velocities[i].z;

        // Boundary check - bounce off edges
        if (Math.abs(node.position.x) > 200) velocities[i].x *= -1;
        if (Math.abs(node.position.y) > 200) velocities[i].y *= -1;
        if (Math.abs(node.position.z) > 200) velocities[i].z *= -1;

        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.002 + i) * 0.2;
        node.scale.set(scale, scale, scale);
      });

      // Update connections
      const linePositions = lines.geometry.attributes.position.array as Float32Array;
      let lineIndex = 0;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = nodes[i].position.distanceTo(nodes[j].position);

          if (distance < connectionDistance) {
            linePositions[lineIndex++] = nodes[i].position.x;
            linePositions[lineIndex++] = nodes[i].position.y;
            linePositions[lineIndex++] = nodes[i].position.z;
            linePositions[lineIndex++] = nodes[j].position.x;
            linePositions[lineIndex++] = nodes[j].position.y;
            linePositions[lineIndex++] = nodes[j].position.z;
          }
        }
      }

      // Clear remaining line positions
      for (let i = lineIndex; i < linePositions.length; i++) {
        linePositions[i] = 0;
      }

      lines.geometry.attributes.position.needsUpdate = true;

      // Rotate entire scene based on mouse
      scene.rotation.y += (mouseRef.current.x * 0.5 - scene.rotation.y) * 0.05;
      scene.rotation.x += (mouseRef.current.y * 0.5 - scene.rotation.x) * 0.05;

      // Rotate particles slowly
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Clean up Three.js resources
      nodes.forEach(node => {
        scene.remove(node);
        node.geometry.dispose();
        (node.material as THREE.Material).dispose();
      });

      scene.remove(lines);
      lines.geometry.dispose();
      (lines.material as THREE.Material).dispose();

      scene.remove(particles);
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();

      if (renderer) {
        renderer.dispose();
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, [nodeCount, connectionDistance]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
