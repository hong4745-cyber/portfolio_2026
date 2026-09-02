import * as React from "react";

interface ProjectData { title: string; image: string; category: string; year: string; description: string; }

const PROJECT_DATA: ProjectData[] = [
  { title: "Redroom Gesture 14", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop", category: "Concept Series", year: "2025", description: "Expressive motion study" },
  { title: "Shadowwear 6AM", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop", category: "Photography", year: "2024", description: "Urban portrait series" },
  { title: "Blur Formation 03", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop", category: "Kinetic Study", year: "2024", description: "Motion blur experiment" },
  { title: "Sunglass Operator", image: "https://images.unsplash.com/photo-1572495641004-28421ae52e52?q=80&w=1887&auto=format&fit=crop", category: "Editorial Motion", year: "2023", description: "Fashion editorial piece" },
];

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;
const projectNumber = (index: number) => (index + 1).toString().padStart(2, "0");

export function Component() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());

  React.useEffect(() => {
    const container = containerRef.current;
    const track = container?.closest<HTMLElement>(".argent-track");
    const scrollRoot = container?.closest<HTMLDivElement>(".icsa-wrap");
    if (!container || !track || !scrollRoot) return;

    let frame = 0;
    let currentY = 0;
    let targetY = 0;
    let projectHeight = container.clientHeight || window.innerHeight;
    const minimapHeight = 250;
    const imagePositions = new WeakMap<HTMLImageElement, number>();

    const updateTarget = () => {
      const rootRect = scrollRoot.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const travel = Math.max(1, trackRect.height - rootRect.height);
      const progress = Math.min(1, Math.max(0, (rootRect.top - trackRect.top) / travel));
      const index = Math.min(PROJECT_DATA.length - 1, Math.max(0, Math.round(progress * (PROJECT_DATA.length - 1))));
      targetY = -index * projectHeight;
    };

    const updateParallax = (img: HTMLImageElement | null, scroll: number, index: number, height: number) => {
      if (!img) return;
      const current = imagePositions.get(img) ?? 0;
      const target = (-scroll - index * height) * 0.2;
      const next = lerp(current, target, 0.1);
      img.style.transform = `translateY(${next}px) scale(1.5)`;
      imagePositions.set(img, next);
    };

    const render = () => {
      currentY = lerp(currentY, targetY, 0.09);
      if (Math.abs(currentY - targetY) < 0.1) currentY = targetY;
      const minimapY = (currentY * minimapHeight) / projectHeight;
      projectsRef.current.forEach((element, index) => {
        element.style.transform = `translateY(${index * projectHeight + currentY}px)`;
        updateParallax(element.querySelector("img"), currentY, index, projectHeight);
      });
      minimapRef.current.forEach((element, index) => {
        element.style.transform = `translateY(${index * minimapHeight + minimapY}px)`;
        updateParallax(element.querySelector("img"), minimapY, index, minimapHeight);
      });
      infoRef.current.forEach((element, index) => { element.style.transform = `translateY(${index * minimapHeight + minimapY}px)`; });
      frame = requestAnimationFrame(render);
    };

    const onResize = () => { projectHeight = container.clientHeight || window.innerHeight; updateTarget(); };
    updateTarget();
    scrollRoot.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(render);
    return () => {
      scrollRoot.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={containerRef} className="argent-slider" aria-label="Project gallery">
      <div className="argent-project-list">
        {PROJECT_DATA.map((data, index) => (
          <div key={data.title} className="argent-project" ref={(element) => { if (element) projectsRef.current.set(index, element); else projectsRef.current.delete(index); }}><img src={data.image} alt={data.title} /></div>
        ))}
      </div>
      <div className="argent-minimap">
        <div className="argent-minimap-preview">
          {PROJECT_DATA.map((data, index) => (
            <div key={data.title} className="argent-minimap-image" ref={(element) => { if (element) minimapRef.current.set(index, element); else minimapRef.current.delete(index); }}><img src={data.image} alt="" /></div>
          ))}
        </div>
        <div className="argent-info-list">
          {PROJECT_DATA.map((data, index) => (
            <div key={data.title} className="argent-info" ref={(element) => { if (element) infoRef.current.set(index, element); else infoRef.current.delete(index); }}>
              <div><span>{projectNumber(index)}</span><strong>{data.title}</strong></div>
              <div><span>{data.category}</span><span>{data.year}</span></div>
              <p>{data.description}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="argent-hint">Scroll to explore</p>
    </div>
  );
}

export default Component;
