export type ParsedVideo = {
  type: "youtube" | "vimeo" | "direct" | "unknown";
  embedUrl: string | null;
  directUrl: string | null;
  id: string | null;
  suggestedThumbnail: string | null;
};

export function parseVideoUrl(url: string | null | undefined): ParsedVideo {
  if (!url || typeof url !== "string") {
    return {
      type: "unknown",
      embedUrl: null,
      directUrl: null,
      id: null,
      suggestedThumbnail: null,
    };
  }

  const trimmed = url.trim();

  // YouTube Shorts: https://youtube.com/shorts/VIDEO_ID or https://www.youtube.com/shorts/VIDEO_ID
  const ytShortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (ytShortsMatch?.[1]) {
    const id = ytShortsMatch[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&controls=0&rel=0&showinfo=0&modestbranding=1`,
      directUrl: null,
      id,
      suggestedThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // YouTube Standard: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID or embed
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch?.[1]) {
    const id = ytMatch[1];
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&controls=0&rel=0&showinfo=0&modestbranding=1`,
      directUrl: null,
      id,
      suggestedThumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // Vimeo: https://vimeo.com/VIDEO_ID
  const vimeoMatch = trimmed.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/,
  );
  if (vimeoMatch?.[2]) {
    const id = vimeoMatch[2];
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1&autopause=0`,
      directUrl: null,
      id,
      suggestedThumbnail: null,
    };
  }

  // Direct Video (mp4, webm, ogg, mov or Firebase storage video)
  const isDirect =
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) ||
    trimmed.includes("firebasestorage.googleapis.com") ||
    trimmed.includes("storage.googleapis.com");

  if (isDirect) {
    return {
      type: "direct",
      embedUrl: null,
      directUrl: trimmed,
      id: null,
      suggestedThumbnail: null,
    };
  }

  // Fallback direct URL attempt if it's an http url
  if (/^https?:\/\//i.test(trimmed)) {
    return {
      type: "direct",
      embedUrl: null,
      directUrl: trimmed,
      id: null,
      suggestedThumbnail: null,
    };
  }

  return {
    type: "unknown",
    embedUrl: null,
    directUrl: null,
    id: null,
    suggestedThumbnail: null,
  };
}
