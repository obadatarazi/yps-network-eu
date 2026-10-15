import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type NetworkGlobeProps = {
  className?: string;
  /** Disable WebGL (e.g. plain-language mode). */
  disabled?: boolean;
  label?: string;
};

/** Lat/lon hubs representing YPS regional collaboration. */
const HUBS: { lat: number; lon: number }[] = [
  { lat: 52.5, lon: 13.4 }, // Europe
  { lat: 33.5, lon: 36.3 }, // MENA
  { lat: 6.5, lon: 3.4 }, // West Africa
  { lat: -1.3, lon: 36.8 }, // East Africa
  { lat: 41.0, lon: 29.0 }, // Eastern Mediterranean
  { lat: 48.9, lon: 2.3 }, // Western Europe
  { lat: 25.2, lon: 55.3 }, // Gulf
  { lat: 14.7, lon: -17.4 }, // Sahel / West
];

const ARC_PAIRS: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [0, 4],
  [5, 1],
  [2, 3],
  [1, 6],
  [2, 7],
  [5, 7],
  [4, 3],
];

function latLonToVec(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

function curvePoints(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
  segments: number,
  lift = 1.35,
) {
  const points: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const z = a.z + (b.z - a.z) * t;
    const len = Math.hypot(x, y, z) || 1;
    const bulge = 1 + Math.sin(Math.PI * t) * (lift - 1);
    points.push((x / len) * 1.02 * bulge, (y / len) * 1.02 * bulge, (z / len) * 1.02 * bulge);
  }
  return points;
}

/** Damped spring (threejs-animation skill: Spring Physics). */
type Spring = { value: number; velocity: number; target: number };

function stepSpring(spring: Spring, dt: number, stiffness = 180, damping = 14) {
  const force = -stiffness * (spring.value - spring.target) - damping * spring.velocity;
  spring.velocity += force * dt;
  spring.value += spring.velocity * dt;
  return spring.value;
}

/** Frame-rate independent lerp factor (smooth damping). */
function damp(rate: number, dt: number) {
  return 1 - Math.exp(-rate * dt);
}

const TAP_SLOP_PX = 6;
const TAP_MAX_MS = 320;
const BURST_LIFE = 1.15;

/**
 * Interactive low-poly network globe: point cloud + collaboration arcs.
 * Drag to spin (with inertia), hover a hub to lift it, tap to send a pulse
 * through the network. Lazy WebGL; pauses offscreen; respects reduced motion.
 */
export function NetworkGlobe({
  className,
  disabled = false,
  label = "Interactive network globe visualising youth peace collaboration",
}: NetworkGlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (disabled || reduced || failed) return;
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | null = null;
    let timer: import("three").Timer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let visible = true;

    // Pointer state (NDC for raycasting, -1..1 for parallax)
    let pointerX = 0;
    let pointerY = 0;
    let pointerInside = false;
    let pointerMoved = false;
    let targetRotY = 0.15;
    let targetRotX = 0.12;
    let currentRotY = 0.15;
    let currentRotX = 0.12;

    // Drag + inertia
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartTime = 0;
    let lastDragX = 0;
    let lastDragTime = 0;
    let dragRotY = 0;
    let spinVelocity = 0;
    let pendingTap: { x: number; y: number } | null = null;

    const setNdc = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const onPointerMove = (event: PointerEvent) => {
      setNdc(event);
      pointerInside = true;
      pointerMoved = true;
      if (dragging) {
        const now = performance.now();
        const dx = event.clientX - lastDragX;
        const dt = Math.max((now - lastDragTime) / 1000, 1 / 240);
        dragRotY += dx * 0.009;
        spinVelocity = (dx * 0.009) / dt;
        lastDragX = event.clientX;
        lastDragTime = now;
        return;
      }
      targetRotY = pointerX * 0.45;
      targetRotX = pointerY * 0.25;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button > 0) return;
      setNdc(event);
      dragging = true;
      dragStartX = lastDragX = event.clientX;
      dragStartY = event.clientY;
      dragStartTime = lastDragTime = performance.now();
      spinVelocity = 0;
      host.setPointerCapture?.(event.pointerId);
      host.style.cursor = "grabbing";
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      host.releasePointerCapture?.(event.pointerId);
      const moved = Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY);
      if (moved < TAP_SLOP_PX && performance.now() - dragStartTime < TAP_MAX_MS) {
        setNdc(event);
        pendingTap = { x: pointerX, y: pointerY };
        spinVelocity = 0;
      }
      // Stale velocity (finger held still before release) should not fling.
      if (performance.now() - lastDragTime > 90) spinVelocity = 0;
      spinVelocity = Math.max(-6, Math.min(6, spinVelocity));
      host.style.cursor = "";
    };

    const onPointerLeave = () => {
      pointerInside = false;
      targetRotY = 0.15;
      targetRotX = 0.12;
    };

    async function boot() {
      const THREE = await import("./three-subset");
      if (disposed || !host) return;

      const width = host.clientWidth || 480;
      const height = host.clientHeight || 360;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.15, 3.55);

      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });
      } catch {
        setFailed(true);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      host.appendChild(renderer.domElement);

      const root = new THREE.Group();
      scene.add(root);

      // Soft atmosphere shells
      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.12, 48, 48),
        new THREE.MeshBasicMaterial({
          color: 0x0099cc,
          transparent: true,
          opacity: 0.12,
          side: THREE.BackSide,
          depthWrite: false,
        }),
      );
      root.add(atmosphere);
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(1.22, 32, 32),
        new THREE.MeshBasicMaterial({
          color: 0x003366,
          transparent: true,
          opacity: 0.08,
          side: THREE.BackSide,
          depthWrite: false,
        }),
      );
      root.add(glow);

      // Wireframe globe
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x66c2e0,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      });
      const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), wireMat);
      root.add(wire);

      // Invisible hit sphere: cheap raycast target for taps (interaction skill:
      // "simple collision meshes").
      const hitSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.02, 24, 24),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      root.add(hitSphere);

      // Point cloud
      const pointCount = 1200;
      const positions = fibonacciSphere(pointCount, 1.01);
      const colors = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount; i++) {
        const t = i / pointCount;
        colors[i * 3] = 0.0 + t * 0.05;
        colors[i * 3 + 1] = 0.35 + t * 0.25;
        colors[i * 3 + 2] = 0.55 + t * 0.35;
      }
      const pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      pointsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const pointsMat = new THREE.PointsMaterial({
        size: 0.022,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const cloud = new THREE.Points(pointsGeo, pointsMat);
      root.add(cloud);

      // Ambient floating particles (bridge mesh)
      const ambientCount = 160;
      const ambientPos = new Float32Array(ambientCount * 3);
      for (let i = 0; i < ambientCount; i++) {
        const r = 1.35 + Math.random() * 0.55;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        ambientPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        ambientPos[i * 3 + 1] = r * Math.cos(phi) * 0.7;
        ambientPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      const ambientGeo = new THREE.BufferGeometry();
      ambientGeo.setAttribute("position", new THREE.BufferAttribute(ambientPos.slice(), 3));
      const ambient = new THREE.Points(
        ambientGeo,
        new THREE.PointsMaterial({
          color: 0x0099cc,
          size: 0.012,
          transparent: true,
          opacity: 0.35,
          depthWrite: false,
        }),
      );
      scene.add(ambient);

      // Hub nodes + halos, each with its own scale spring
      const hubVecs = HUBS.map((h) => latLonToVec(h.lat, h.lon, 1.02));
      const hubGeo = new THREE.SphereGeometry(0.034, 14, 14);
      const hubMat = new THREE.MeshBasicMaterial({ color: 0xf4b400 });
      const hubHaloGeo = new THREE.SphereGeometry(0.055, 12, 12);
      const hubs = new THREE.Group();
      const hubCores: import("three").Mesh[] = [];
      const hubHalos: import("three").Mesh[] = [];
      const hubSprings: Spring[] = [];
      for (const [index, v] of hubVecs.entries()) {
        const mesh = new THREE.Mesh(hubGeo, hubMat);
        mesh.position.set(v.x, v.y, v.z);
        mesh.userData.hubIndex = index;
        const halo = new THREE.Mesh(
          hubHaloGeo,
          new THREE.MeshBasicMaterial({
            color: 0xf4b400,
            transparent: true,
            opacity: 0.22,
            depthWrite: false,
          }),
        );
        halo.position.set(v.x, v.y, v.z);
        hubs.add(mesh, halo);
        hubCores.push(mesh);
        hubHalos.push(halo);
        hubSprings.push({ value: 1, velocity: 0, target: 1 });
      }
      root.add(hubs);

      const segmentPositions: number[] = [];
      for (const [i, j] of ARC_PAIRS) {
        const a = hubVecs[i];
        const b = hubVecs[j];
        if (!a || !b) continue;
        const curve = curvePoints(a, b, 32, 1.42);
        for (let s = 0; s < curve.length / 3 - 1; s++) {
          segmentPositions.push(
            curve[s * 3]!,
            curve[s * 3 + 1]!,
            curve[s * 3 + 2]!,
            curve[(s + 1) * 3]!,
            curve[(s + 1) * 3 + 1]!,
            curve[(s + 1) * 3 + 2]!,
          );
        }
      }
      const segmentsGeo = new THREE.BufferGeometry();
      segmentsGeo.setAttribute("position", new THREE.Float32BufferAttribute(segmentPositions, 3));
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x33bbdd,
        transparent: true,
        opacity: 0.72,
      });
      const arcLines = new THREE.LineSegments(segmentsGeo, arcMat);
      root.add(arcLines);

      // Traveling pulse dots along arcs
      const pulses = new THREE.Group();
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });
      const pulseGeo = new THREE.SphereGeometry(0.02, 10, 10);
      const pulsePaths = ARC_PAIRS.map(([i, j]) => curvePoints(hubVecs[i]!, hubVecs[j]!, 40, 1.42));
      const pulseMeshes = pulsePaths.map(() => {
        const m = new THREE.Mesh(pulseGeo, pulseMat);
        pulses.add(m);
        return m;
      });
      const pulseProgress = pulsePaths.map((_, index) => index * 0.17);
      root.add(pulses);

      // Tap bursts: expanding rings that hug the globe surface
      const ringGeo = new THREE.RingGeometry(0.062, 0.07, 64);
      const zAxis = new THREE.Vector3(0, 0, 1);
      const bursts: { mesh: import("three").Mesh; age: number; delay: number }[] = [];
      let flash = 0;

      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      let hovered = -1;

      function spawnBurst(localPoint: import("three").Vector3, strong: boolean) {
        const normal = localPoint.clone().normalize();
        const rings = strong ? 3 : 2;
        for (let r = 0; r < rings; r++) {
          const mesh = new THREE.Mesh(
            ringGeo,
            new THREE.MeshBasicMaterial({
              color: r === 0 ? 0xf4b400 : 0x66d4f0,
              transparent: true,
              opacity: 0,
              side: THREE.DoubleSide,
              depthWrite: false,
            }),
          );
          mesh.position.copy(normal).multiplyScalar(1.025);
          mesh.quaternion.setFromUnitVectors(zAxis, normal);
          root.add(mesh);
          bursts.push({ mesh, age: 0, delay: r * 0.16 });
        }
        while (bursts.length > 12) {
          const old = bursts.shift();
          if (old) {
            root.remove(old.mesh);
            (old.mesh.material as import("three").Material).dispose();
          }
        }
        flash = strong ? 1 : 0.7;
      }

      function handleTap(tap: { x: number; y: number }) {
        ndc.set(tap.x, -tap.y);
        raycaster.setFromCamera(ndc, camera);
        const hubHit = raycaster.intersectObjects(hubCores, false)[0];
        if (hubHit) {
          const index = hubHit.object.userData.hubIndex as number;
          const spring = hubSprings[index];
          if (spring) spring.velocity += 28; // "pop" impulse
          spawnBurst(hubHit.object.position.clone(), true);
          return;
        }
        const surfaceHit = raycaster.intersectObject(hitSphere, false)[0];
        if (surfaceHit) spawnBurst(root.worldToLocal(surfaceHit.point.clone()), false);
      }

      timer = new THREE.Timer();
      timer.connect(document);

      const resize = () => {
        if (!renderer || !host) return;
        const w = host.clientWidth;
        const h = host.clientHeight;
        if (w < 2 || h < 2) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          visible = Boolean(entry?.isIntersecting);
        },
        { threshold: 0.05 },
      );
      visibilityObserver.observe(host);

      host.style.touchAction = "pan-y";
      host.style.cursor = "grab";
      host.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerdown", onPointerDown);
      host.addEventListener("pointerup", onPointerUp);
      host.addEventListener("pointercancel", onPointerUp);
      host.addEventListener("pointerleave", onPointerLeave);

      let autoSpin = 0;
      const spinRate: Spring = { value: 0.12, velocity: 0, target: 0.12 };

      const renderLoop = (timestamp?: number) => {
        if (disposed || !renderer || !timer) return;
        frame = requestAnimationFrame(renderLoop);
        timer.update(timestamp);
        if (!visible) return;

        const dt = Math.min(timer.getDelta(), 0.05);
        const t = timer.getElapsed();

        // Hover: raycast hubs at most once per frame, only after the pointer moved.
        if (pointerMoved && pointerInside && !dragging) {
          pointerMoved = false;
          ndc.set(pointerX, -pointerY);
          raycaster.setFromCamera(ndc, camera);
          const hit = raycaster.intersectObjects(hubCores, false)[0];
          hovered = hit ? (hit.object.userData.hubIndex as number) : -1;
          host.style.cursor = hovered >= 0 ? "pointer" : "grab";
        } else if (!pointerInside) {
          hovered = -1;
        }

        if (pendingTap) {
          handleTap(pendingTap);
          pendingTap = null;
        }

        // Rotation = auto spin (slows while a hub is hovered) + drag + parallax.
        spinRate.target = hovered >= 0 || dragging ? 0.025 : 0.12;
        autoSpin += stepSpring(spinRate, dt, 40, 12) * dt;
        if (!dragging) {
          dragRotY += spinVelocity * dt;
          spinVelocity *= Math.exp(-2.4 * dt);
        }
        currentRotY += (targetRotY - currentRotY) * damp(2.4, dt);
        currentRotX += (targetRotX - currentRotX) * damp(2.4, dt);

        root.rotation.y = autoSpin + dragRotY + currentRotY;
        root.rotation.x = 0.18 + currentRotX * 0.35;
        glow.scale.setScalar(1 + Math.sin(t * 1.4) * 0.015 + flash * 0.04);
        ambient.rotation.y = -t * 0.04;
        ambient.rotation.x = Math.sin(t * 0.2) * 0.05;

        // Hub springs: hovered hub lifts, tapped hub pops.
        hubSprings.forEach((spring, index) => {
          spring.target = index === hovered ? 1.9 : 1;
          const scale = Math.max(0.4, stepSpring(spring, dt));
          hubCores[index]?.scale.setScalar(scale);
          const halo = hubHalos[index];
          if (halo) {
            halo.scale.setScalar(scale * (1 + Math.sin(t * 2.2 + index) * 0.08));
            (halo.material as import("three").MeshBasicMaterial).opacity =
              index === hovered ? 0.45 : 0.22;
          }
        });

        // Mouse displacement on ambient particles
        const pos = ambientGeo.getAttribute("position") as import("three").BufferAttribute;
        for (let i = 0; i < ambientCount; i++) {
          const base = i * 3;
          pos.setXYZ(
            i,
            ambientPos[base]! + pointerX * 0.08 * Math.sin(t + i),
            ambientPos[base + 1]! + pointerY * 0.06 * Math.cos(t + i * 0.5),
            ambientPos[base + 2]!,
          );
        }
        pos.needsUpdate = true;

        // Pulses travel faster for a moment after a tap.
        const speedBoost = 1 + flash * 2.5;
        pulseMeshes.forEach((mesh, index) => {
          const path = pulsePaths[index];
          if (!path) return;
          pulseProgress[index] = (pulseProgress[index]! + (0.12 + index * 0.02) * speedBoost * dt) % 1;
          const u = pulseProgress[index]!;
          const idx = Math.floor(u * (path.length / 3 - 1));
          mesh.position.set(path[idx * 3]!, path[idx * 3 + 1]!, path[idx * 3 + 2]!);
        });
        pulseMat.opacity = 0.7 + flash * 0.3;

        // Bursts: rings expand and fade (ease-out).
        for (let i = bursts.length - 1; i >= 0; i--) {
          const burst = bursts[i]!;
          burst.age += dt;
          const life = (burst.age - burst.delay) / BURST_LIFE;
          const mat = burst.mesh.material as import("three").MeshBasicMaterial;
          if (life < 0) continue;
          if (life >= 1) {
            root.remove(burst.mesh);
            mat.dispose();
            bursts.splice(i, 1);
            continue;
          }
          const eased = 1 - Math.pow(1 - life, 3);
          burst.mesh.scale.setScalar(1 + eased * 4.5);
          mat.opacity = 0.9 * (1 - life) * (1 - life);
        }

        flash *= Math.exp(-2.2 * dt);
        arcMat.opacity = 0.35 + Math.sin(t * 1.2) * 0.15 + flash * 0.45;
        wireMat.opacity = 0.28 + flash * 0.18;

        renderer.render(scene, camera);
      };

      renderLoop();
    }

    void boot();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointerup", onPointerUp);
      host.removeEventListener("pointercancel", onPointerUp);
      host.removeEventListener("pointerleave", onPointerLeave);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      timer?.dispose();
      timer = null;
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
        renderer = null;
      }
    };
  }, [disabled, reduced, failed]);

  if (disabled || reduced || failed) {
    return (
      <div
        className={className}
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, color-mix(in srgb, var(--color-accent) 35%, transparent), transparent 55%), radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--color-action) 40%, transparent), transparent 60%), var(--color-inverse)",
        }}
      />
    );
  }

  if (!label) {
    return <div ref={hostRef} className={className} aria-hidden="true" />;
  }

  return <div ref={hostRef} className={className} role="img" aria-label={label} />;
}
