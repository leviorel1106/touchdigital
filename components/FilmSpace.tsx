"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { MathUtils, type Group } from "three";

const images = ["/showreel/culinary.jpg", "/showreel/villa.jpg", "/showreel/fashion.jpg"];

function Screens({ active, onReady }: { active: number; onReady: () => void }) {
  const group = useRef<Group>(null);
  const cards = useRef<(Group | null)[]>([]);
  const textures = useTexture(images);
  const { invalidate, gl } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => { onReady(); invalidate(); }, [onReady, invalidate]);
  useEffect(() => { invalidate(); }, [active, invalidate]);
  useEffect(() => {
    const element = gl.domElement;
    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      pointer.current = { x: (event.clientX - rect.left) / rect.width - .5, y: (event.clientY - rect.top) / rect.height - .5 };
      invalidate();
    };
    const leave = () => { pointer.current = { x: 0, y: 0 }; invalidate(); };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", leave);
    return () => { element.removeEventListener("pointermove", move); element.removeEventListener("pointerleave", leave); };
  }, [gl, invalidate]);
  useFrame((_, delta) => {
    let moving = false;
    const damp = (value: number, target: number) => {
      const result = MathUtils.damp(value, target, 5, Math.min(delta, .1));
      if (Math.abs(result - target) > .001) moving = true;
      return Math.abs(result - target) < .001 ? target : result;
    };
    if (group.current) {
      group.current.rotation.y = damp(group.current.rotation.y, pointer.current.x * .22);
      group.current.rotation.x = damp(group.current.rotation.x, pointer.current.y * .12);
    }
    cards.current.forEach((card, index) => {
      if (!card) return;
      const offset = ((index - active + 4) % 3) - 1;
      card.position.x = damp(card.position.x, offset * 2.8);
      card.position.z = damp(card.position.z, offset === 0 ? .6 : -1.8);
      card.position.y = damp(card.position.y, offset === 0 ? 0 : offset * .3);
      card.rotation.y = damp(card.rotation.y, offset * -.32);
      card.rotation.z = damp(card.rotation.z, offset * -.045);
    });
    if (moving) invalidate();
  });
  return <group ref={group}>
    {textures.map((texture, index) => <group key={images[index]} ref={(node) => { cards.current[index] = node; }} position={[(index - 1) * 2.8, 0, -1]}>
      <mesh position={[0, 0, -.06]}><boxGeometry args={[4.9, 2.81, .1]} /><meshStandardMaterial color="#343b4a" metalness={.8} roughness={.25} /></mesh>
      <mesh><planeGeometry args={[4.8, 2.7]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
      <mesh position={[0, -1.46, -.02]}><boxGeometry args={[4.85, .015, .03]} /><meshBasicMaterial color="#749bff" /></mesh>
    </group>)}
  </group>;
}

export default function FilmSpace({ active, onReady }: { active: number; onReady: () => void }) {
  return <Canvas className="film-space-canvas" frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, .15, 8], fov: 42 }} gl={{ alpha: true, antialias: true }} fallback={null}>
    <ambientLight intensity={2} /><directionalLight position={[3, 4, 5]} intensity={3} />
    <Suspense fallback={null}><Screens active={active} onReady={onReady} /></Suspense>
  </Canvas>;
}
