import React, { useRef, useEffect } from 'react';

interface FrequencyVisualizerProps {
  isPlaying: boolean;
  frequency: number;
  pemfFrequency?: number;
}

const FrequencyVisualizer: React.FC<FrequencyVisualizerProps> = ({ isPlaying, frequency, pemfFrequency }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const resizeCanvas = () => {
        const { devicePixelRatio: ratio = 1 } = window;
        const parent = canvas.parentElement;
        if (!parent) return;
        const { clientWidth } = parent;
        // Ensure we don't render a 0x0 canvas
        const canvasWidth = Math.max(clientWidth, 150);
        const canvasHeight = canvasWidth * 0.75;

        canvas.width = canvasWidth * ratio;
        canvas.height = canvasHeight * ratio;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.scale(ratio, ratio);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();


    const render = () => {
      time += 0.02;
      const { width, height } = canvas;
      const { devicePixelRatio: ratio = 1 } = window;
      const viewWidth = width / ratio;
      const viewHeight = height / ratio;
      
      ctx.clearRect(0, 0, width, height);
      
      const centerX = viewWidth / 2;
      const centerY = viewHeight / 2;
      
      const baseRadius = Math.min(centerX, centerY) * 0.3;
      
      const pulseRate = isPlaying ? (pemfFrequency || frequency / 100) : 0;
      const mainPulsation = isPlaying && pemfFrequency ? (Math.sin(time * pulseRate) + 1) / 2 * 20 : Math.sin(time * pulseRate) * 10;
      const subtlePulsation = isPlaying ? Math.sin(time) * 5 : 0;
      const pulsation = mainPulsation + subtlePulsation;
      
      // Draw concentric rings
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        const radius = baseRadius + (i*i * 10) + pulsation * (i/2);
        if (radius > 0) {
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 / i})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
      }

      // Draw central orb
      const grad = ctx.createRadialGradient(centerX, centerY, baseRadius/2, centerX, centerY, Math.max(0, baseRadius + pulsation));
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(0.5, 'rgba(192, 132, 252, 0.6)');
      grad.addColorStop(1, 'rgba(124, 58, 237, 0)');
      
      ctx.fillStyle = grad;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = isPlaying ? 30 : 15;

      ctx.beginPath();
      const finalRadius = baseRadius + pulsation;
      if (finalRadius > 0) {
        ctx.arc(centerX, centerY, finalRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;


      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isPlaying, frequency, pemfFrequency]);

  return <canvas ref={canvasRef} className="w-full h-auto" style={{aspectRatio: '4 / 3'}} />;
};

export default FrequencyVisualizer;
