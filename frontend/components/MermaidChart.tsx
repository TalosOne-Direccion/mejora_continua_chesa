import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    primaryColor: '#f9f9ff',
    primaryTextColor: '#161c27',
    primaryBorderColor: '#c3c6d1',
    lineColor: '#586377',
    secondaryColor: '#dde2f3',
    tertiaryColor: '#f1f3ff'
  },
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif'
});

interface Props {
  chart: string;
}

export const MermaidChart: React.FC<Props> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!chart || !containerRef.current) return;
      
      try {
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch (err: any) {
        console.error("Mermaid rendering error:", err);
        if (isMounted) {
          setError(err.message || "Error de sintaxis en el diagrama generado por IA.");
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-error-container border border-error rounded flex items-start gap-3 text-on-error-container">
        <span className="material-symbols-outlined mt-0.5">warning</span>
        <div>
          <h4 className="font-label-md text-label-md">No se pudo renderizar el diagrama</h4>
          <p className="font-mono-md text-mono-md mt-1 bg-surface-container-highest p-2 rounded overflow-x-auto">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-x-auto flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};