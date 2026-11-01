export function isVideoFile(file: File) {
  return file.type.startsWith("video/") || /\.(mp4|mov|webm|m4v)$/i.test(file.name);
}

export function isVideoSrc(src: string) {
  if (!src) return false;
  return src.startsWith("data:video") || /\.(mp4|webm|mov|m4v)(\?|$)/i.test(src);
}

export function fileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (file.type.includes("webm")) return "webm";
  if (file.type.includes("quicktime") || file.type.includes("mp4")) return "mp4";
  return "bin";
}

export function videoDurationSeconds(file: File) {
  return new Promise<number>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const duration = video.duration;
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(duration) ? duration : 0);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this video"));
    };
    video.src = url;
  });
}
