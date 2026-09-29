import { useState, useRef, useEffect } from "react";
import { parseVideoUrl } from "@/lib/video";
import { Play, Volume2, VolumeX, Maximize2, X, ExternalLink } from "lucide-react";

export type VideoCardProps = {
  id?: string;
  title: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  views?: string | null;
  platform?: string | null;
  clientName?: string | null;
  aspectRatio?: "9/16" | "16/9" | "auto";
  priority?: boolean;
};

export function AutoplayVideoCard({
  title,
  videoUrl,
  thumbnailUrl,
  views,
  platform,
  clientName,
  aspectRatio = "9/16",
}: VideoCardProps) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const parsed = parseVideoUrl(videoUrl);

  // Suggested thumbnail if user didn't specify one
  const effectiveThumb = thumbnailUrl || parsed.suggestedThumbnail || "";

  useEffect(() => {
    // Reset ready state if URL changes
    setVideoReady(false);
    setVideoFailed(false);
  }, [videoUrl]);

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }

  function handleCardClick(e: React.MouseEvent) {
    if (!videoUrl) return;
    // Open full modal player on click
    setModalOpen(true);
  }

  const aspectClass =
    aspectRatio === "9/16"
      ? "aspect-[9/16]"
      : aspectRatio === "16/9"
        ? "aspect-[16/9]"
        : "aspect-[9/16]";

  return (
    <>
      <div
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick(e as never)}
        className={`group relative block w-full overflow-hidden rounded-xl border border-border bg-surface ${aspectClass} cursor-pointer select-none`}
      >
        {/* THUMBNAIL (Shown while video is loading upto when it starts playing) */}
        {effectiveThumb ? (
          <img
            src={effectiveThumb}
            alt={title}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady && !videoFailed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          />
        ) : (
          <div
            className={`absolute inset-0 grid place-items-center bg-surface-2 text-muted-foreground transition-opacity duration-700 ${
              videoReady ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <Play className="h-8 w-8 text-primary/50" />
              <span className="text-xs uppercase tracking-wider">{title}</span>
            </div>
          </div>
        )}

        {/* AUTOPLAY VIDEO: Direct HTML5 Video */}
        {parsed.type === "direct" && parsed.directUrl && !videoFailed && (
          <video
            ref={videoRef}
            src={parsed.directUrl}
            poster={effectiveThumb || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            onError={() => {
              setVideoFailed(true);
              setVideoReady(false);
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* AUTOPLAY VIDEO: Embedded Iframe (YouTube / Shorts / Vimeo) */}
        {(parsed.type === "youtube" || parsed.type === "vimeo") &&
          parsed.embedUrl &&
          !videoFailed && (
            <iframe
              src={parsed.embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => {
                // Delay slightly to give iframe engine time to render the first frame
                setTimeout(() => setVideoReady(true), 600);
              }}
              onError={() => setVideoFailed(true)}
              className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                videoReady ? "opacity-100 scale-105" : "opacity-0"
              }`}
            />
          )}

        {/* Loading Spinner Pulse (while video is loading and thumbnail is shown) */}
        {!videoReady && videoUrl && !videoFailed && (
          <div className="pointer-events-none absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
            <span>Loading</span>
          </div>
        )}

        {/* Hover / Overlay Controls */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 opacity-80 group-hover:opacity-100 transition-opacity" />

        {/* Center Hover Play Icon */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-lg backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {platform && (
            <span className="rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
              {platform}
            </span>
          )}
          {clientName && (
            <span className="rounded bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              {clientName}
            </span>
          )}
        </div>

        {/* Sound Toggle (for direct videos) */}
        {parsed.type === "direct" && videoReady && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="pointer-events-auto absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-white backdrop-blur hover:bg-primary transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}

        {/* Bottom Metadata */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5">
          {views && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Play className="h-3 w-3 fill-current" />
              <span>{views} Views</span>
            </div>
          )}
          <div className="mt-0.5 truncate text-sm font-semibold text-white drop-shadow">
            {title}
          </div>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL ON CLICK */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative flex flex-col items-center max-h-[92vh] max-w-lg w-full rounded-2xl border border-border bg-surface p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full items-center justify-between pb-3 border-b border-border">
              <div className="min-w-0 pr-4">
                <h3 className="truncate text-sm font-bold uppercase">{title}</h3>
                <p className="text-xs text-muted-foreground">
                  {[platform, clientName, views && `${views} views`].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {videoUrl && (
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-8 w-8 place-items-center rounded-md border border-border hover:border-primary text-muted-foreground hover:text-foreground"
                    title="Open original link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <button
                  onClick={() => setModalOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-surface-2 text-muted-foreground hover:text-foreground"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Video Player in Modal */}
            <div className="mt-4 relative w-full aspect-[9/16] max-h-[70vh] rounded-xl overflow-hidden bg-black flex items-center justify-center">
              {parsed.type === "direct" && parsed.directUrl ? (
                <video
                  src={parsed.directUrl}
                  poster={effectiveThumb || undefined}
                  autoPlay
                  controls
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (parsed.type === "youtube" || parsed.type === "vimeo") && parsed.embedUrl ? (
                <iframe
                  src={
                    parsed.type === "youtube"
                      ? `https://www.youtube.com/embed/${parsed.id}?autoplay=1&controls=1&modestbranding=1`
                      : parsed.embedUrl
                  }
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Play className="h-12 w-12 text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">Video preview link:</p>
                  <a
                    href={videoUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground font-semibold"
                  >
                    Watch Video <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
