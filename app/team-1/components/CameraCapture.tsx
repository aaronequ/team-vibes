"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "./ui/Button";

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  onCancel?: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError(
          "Camera is not supported in this browser. Please upload a photo instead.",
        );
        return;
      }

      // Stop any previously-open stream before requesting a new one.
      stopStream();

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch {
        // Fallback for devices that reject advanced constraints.
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => undefined);
      }
    } catch (err) {
      setError(
        "Unable to access camera. Please check permissions or use photo upload.",
      );
      console.error(err);
    }
  }, [stopStream]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    startCamera();
    return () => {
      stopStream();
    };
  }, [startCamera, stopStream]);

  const capturePhoto = useCallback(() => {
    try {
      if (videoRef.current && canvasRef.current && streamRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Use fallback if video width/height is 0 to avoid silent failures
        let width = video.videoWidth || 640;
        let height = video.videoHeight || 480;

        const MAX_WIDTH = 1024;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, width, height);
          const base64 = canvas.toDataURL("image/jpeg", 0.7);
          setCapturedImage(base64);

          // Stop stream after capture
          stopStream();
        } else {
          alert("Could not get 2D context from canvas");
        }
      } else {
        // Fallback for demo when camera stream is not active (e.g., iOS HTTP context)
        const fakeBase64 = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        setCapturedImage(fakeBase64);
      }
    } catch (err: any) {
      alert("Error capturing photo: " + err.message);
      console.error(err);
    }
  }, [stopStream]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const handleUsePhoto = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // Downscale uploaded image too
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const MAX_WIDTH = 1024;
            let width = img.width;
            let height = img.height;
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              setCapturedImage(canvas.toDataURL("image/jpeg", 0.7));
              stopStream();
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full h-full bg-black text-white overflow-hidden">
      {/* 1. Preview or Live Video */}
      {!capturedImage ? (
        error ? (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900 z-10">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Scan Your Fridge</h2>
            <p className="text-slate-400 max-w-xs text-sm leading-relaxed mb-8">
              Take a photo of your ingredients to generate personalized AI recipes instantly.
            </p>
            <label className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold cursor-pointer transition-all duration-200 active:scale-95 shadow-lg shadow-primary/20">
              Take Photo / Upload
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {capturedImage === "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" ? (
            // Render a modern, highly branded mock camera view if we did a fake capture
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-secondary via-primary to-slate-900 text-center p-8">
              <span className="text-6xl mb-6 animate-bounce">📸</span>
              <h2 className="text-2xl font-bold text-white mb-2">Photo Captured!</h2>
              <p className="text-slate-300 max-w-xs text-sm leading-relaxed">
                We've snapped a demo shot of your fridge. Tap 'Use Photo' to scan your ingredients!
              </p>
            </div>
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* 2. Absolute Bottom Overlay Controls */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between px-8 pb-8 z-20">
        {!capturedImage ? (
          <>
            <Button variant="ghost" className="text-white" onClick={onCancel}>
              Cancel
            </Button>

            {!error && (
              <button
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-full bg-white"></div>
              </button>
            )}

            {/* Empty balance spacer to keep the shutter button perfectly centered */}
            <div className="w-16" />
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-white"
              onClick={retakePhoto}
            >
              Retake
            </Button>
            <Button variant="primary" onClick={handleUsePhoto}>
              Use Photo
            </Button>
          </>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
