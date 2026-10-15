import { useEffect, useRef } from "react";

/** Small decorative envelope. The heading next to it is the message. */
export function MessageSentMark() {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = holder.current;
    if (!root) return;
    let stopped = false;
    let release = () => {};

    void import("three").then((THREE) => {
      if (stopped || !holder.current) return;

      const width = 160;
      const height = 128;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 20);
      camera.position.set(0, 0.2, 4.4);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.setAttribute("aria-hidden", "true");
      holder.current.replaceChildren(canvas);

      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(2.2, 3.2, 4);
      scene.add(key);

      const paper = new THREE.MeshStandardMaterial({ color: 0xf8f9fa, roughness: 0.5, metalness: 0.04 });
      const navy = new THREE.MeshStandardMaterial({ color: 0x003366, roughness: 0.42, metalness: 0.08 });
      const gold = new THREE.MeshStandardMaterial({ color: 0xf4b400, roughness: 0.32, metalness: 0.25 });

      const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.12, 0.08), paper);
      const flapShape = new THREE.Shape();
      flapShape.moveTo(-0.85, 0);
      flapShape.lineTo(0.85, 0);
      flapShape.lineTo(0, -0.52);
      flapShape.closePath();
      const flap = new THREE.Mesh(new THREE.ShapeGeometry(flapShape), navy);
      flap.position.set(0, 0.56, 0.05);
      const seal = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), gold);
      seal.position.set(0, 0.18, 0.12);

      const group = new THREE.Group();
      group.add(body, flap, seal);
      scene.add(group);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const started = performance.now();
      let frame = 0;
      const tick = (now: number) => {
        if (stopped) return;
        const t = (now - started) / 1000;
        if (!reduce) {
          group.rotation.y = Math.sin(t * 0.7) * 0.4;
          group.rotation.x = Math.sin(t * 0.45) * 0.08;
          group.position.y = Math.sin(t * 1.1) * 0.05;
        }
        renderer.render(scene, camera);
        if (!reduce) frame = requestAnimationFrame(tick);
      };
      tick(performance.now());

      release = () => {
        cancelAnimationFrame(frame);
        body.geometry.dispose();
        flap.geometry.dispose();
        seal.geometry.dispose();
        paper.dispose();
        navy.dispose();
        gold.dispose();
        renderer.dispose();
        canvas.remove();
      };
    });

    return () => {
      stopped = true;
      release();
    };
  }, []);

  return <div ref={holder} className="mx-auto h-32 w-40" aria-hidden="true" />;
}
