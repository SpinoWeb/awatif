import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { children, createEffect, createSignal, on, onMount } from "solid-js";

export function Viewer(props: any) {
  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let renderer: THREE.Renderer;
  let camera: THREE.PerspectiveCamera;

  onMount(() => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1.0, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1;
    controls.maxDistance = 40;

    container.appendChild(renderer.domElement);
    camera.position.set(0, 5, 10);
    controls.update();

    // on control change
    controls.addEventListener("change", () => {
      renderer.render(scene, camera);
    });

    // on container size change
    new ResizeObserver((entries) => {
      const c = entries[0].contentRect;

      camera.aspect = c.width / c.height;
      camera.updateProjectionMatrix();

      renderer.setSize(c.width, c.height);
      renderer.render(scene, camera);
    }).observe(container);
  });

  // on children (objects) change
  createEffect(() => {
    const objects = children(() => props.children).toArray();

    if (scene) {
      scene.clear();
      objects.forEach((object: any) => {
        if (object instanceof THREE.Object3D) scene.add(object);
      });
    }

    if (renderer) renderer.render(scene, camera);
  });

  // on render action
  createEffect(
    on(renderAction, () => {
      if (renderer) renderer.render(scene, camera);
    })
  );

  return (
    <>
      <div ref={container!} class="w-full h-full"></div>
    </>
  );
}

// actions
export const [renderAction, setRenderAction] = createSignal(0);
