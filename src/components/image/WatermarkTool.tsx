"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import FileDropzone from "@/components/common/FileDropzone";
import DownloadButton from "@/components/common/DownloadButton";
import {
  getMaxBatchSize,
  fileToDataUrl,
  loadImage,
  validateImageFiles,
  createNewFileName,
  mimeToExtension,
  outputTypeFor,
} from "@/lib/common/fileUtils";
import {
  applyWatermark,
  drawWatermark,
  WatermarkMode,
  WatermarkPosition,
  WatermarkOptions,
} from "@/lib/image/watermark";
import { useBeforeUnload, useMaxBatchSize } from "@/lib/common/hooks";
import { isWebPSupported } from "@/lib/image/convert";
import { trackToolUse } from "@/lib/common/analytics";

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp";
const LOGO_ACCEPT = "image/png,image/webp,image/jpeg";
// auto = 원본 형식을 따름(JPG 사진은 JPG, PNG·WebP는 투명을 지키도록 PNG).
// 예전 기본값 PNG는 15.8MB JPG 사진을 47.2MB PNG로 만들었다(실측, docs/blog-data/watermark-2026-10-16.json).
type OutputFormat = "auto" | "image/png" | "image/jpeg";

/** '자동': JPG는 JPG, WebP는 WebP(인코딩 미지원이면 PNG), 그 밖(PNG 등)은 투명을 지키는 PNG */
function autoFormat(file: File): "image/jpeg" | "image/png" | "image/webp" {
  const t = outputTypeFor(file);
  if (t === "image/jpeg") return t;
  if (t === "image/webp" && isWebPSupported()) return t;
  return "image/png";
}

interface SourceImage {
  id: string;
  file: File;
  dataUrl: string;
  img: HTMLImageElement;
  width: number;
  height: number;
}

const POSITIONS: { v: WatermarkPosition; label: string; koLabel: string }[] = [
  { v: "top-left", label: "↖", koLabel: "왼쪽 위" },
  { v: "top-center", label: "↑", koLabel: "가운데 위" },
  { v: "top-right", label: "↗", koLabel: "오른쪽 위" },
  { v: "middle-left", label: "←", koLabel: "왼쪽 가운데" },
  { v: "center", label: "•", koLabel: "정중앙" },
  { v: "middle-right", label: "→", koLabel: "오른쪽 가운데" },
  { v: "bottom-left", label: "↙", koLabel: "왼쪽 아래" },
  { v: "bottom-center", label: "↓", koLabel: "가운데 아래" },
  { v: "bottom-right", label: "↘", koLabel: "오른쪽 아래" },
];

const PREVIEW_MAX = 560;

export default function WatermarkTool() {
  const [images, setImages] = useState<SourceImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [mode, setMode] = useState<WatermarkMode>("text");
  const [text, setText] = useState("");
  const [fontScale, setFontScale] = useState(6);
  const [color, setColor] = useState("#FFFFFF");
  const [bold, setBold] = useState(true);

  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(20);

  const [opacity, setOpacity] = useState(50);
  const [position, setPosition] = useState<WatermarkPosition>("bottom-right");
  const [rotation, setRotation] = useState(0);
  const [tile, setTile] = useState(false);
  const [margin, setMargin] = useState(4);

  const [outputFormat, setOutputFormat] = useState<OutputFormat>("auto");
  const [quality, setQuality] = useState(92);

  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ name: string; blob: Blob }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  useBeforeUnload(isProcessing);
  const maxBatchSize = useMaxBatchSize();

  const imagesRef = useRef<SourceImage[]>([]);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const previewRef = useRef<HTMLCanvasElement>(null);
  // 선택 이미지의 다운스케일 베이스 캔버스 캐시 (슬라이더 드래그 시 풀해상도 재합성 방지)
  const previewBaseRef = useRef<{ id: string; canvas: HTMLCanvasElement } | null>(null);
  // 결과 생성 시 한 번 스크롤
  const resultRef = useRef<HTMLDivElement>(null);
  const hadResultRef = useRef(false);

  const selectedImg =
    images.find((i) => i.id === selectedId) ?? images[0] ?? null;

  // 현재 설정으로 워터마크 옵션 구성 (미리보기/적용 공용)
  const buildOptions = useCallback(
    (): WatermarkOptions => ({
      mode,
      text,
      fontScale,
      color,
      bold,
      logoImg,
      logoScale,
      opacity,
      position,
      rotation,
      tile,
      margin,
      outputFormat: outputFormat === "auto" ? undefined : outputFormat,
      quality: quality / 100,
    }),
    [
      mode, text, fontScale, color, bold, logoImg, logoScale,
      opacity, position, rotation, tile, margin, outputFormat, quality,
    ],
  );

  // 미리보기에 영향을 주는 옵션만 (outputFormat/quality는 표시 픽셀과 무관 — 인코딩 안 함)
  const previewOptions = useMemo<WatermarkOptions>(
    () => ({
      mode, text, fontScale, color, bold, logoImg, logoScale,
      opacity, position, rotation, tile, margin,
    }),
    [mode, text, fontScale, color, bold, logoImg, logoScale, opacity, position, rotation, tile, margin],
  );

  // 실시간 미리보기 — 원본을 PREVIEW_MAX로 한 번만 축소한 베이스에 워터마크만 다시 그린다.
  // (대형 이미지에서 슬라이더 드래그 시 풀해상도 캔버스 재할당을 피해 끊김 방지)
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !selectedImg) return;
    const pctx = canvas.getContext("2d");
    if (!pctx) return;
    try {
      let cache = previewBaseRef.current;
      if (!cache || cache.id !== selectedImg.id) {
        const scale = Math.min(
          1,
          PREVIEW_MAX / Math.max(selectedImg.width, selectedImg.height),
        );
        const w = Math.max(1, Math.round(selectedImg.width * scale));
        const h = Math.max(1, Math.round(selectedImg.height * scale));
        const base = document.createElement("canvas");
        base.width = w;
        base.height = h;
        const bx = base.getContext("2d");
        if (!bx) return;
        bx.imageSmoothingEnabled = true;
        bx.imageSmoothingQuality = "high";
        bx.drawImage(selectedImg.img, 0, 0, w, h);
        cache = { id: selectedImg.id, canvas: base };
        previewBaseRef.current = cache;
      }
      const base = cache.canvas;
      canvas.width = base.width;
      canvas.height = base.height;
      pctx.clearRect(0, 0, canvas.width, canvas.height);
      pctx.imageSmoothingEnabled = true;
      pctx.imageSmoothingQuality = "high";
      pctx.drawImage(base, 0, 0);
      drawWatermark(pctx, canvas.width, canvas.height, previewOptions);
    } catch {
      // 미리보기 실패 시 직전 합성이 남지 않도록 비운다 (적용 시 에러로 안내)
      pctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [selectedImg, previewOptions]);

  // 결과가 처음 생기면 결과 영역으로 한 번 스크롤 (긴 설정 패널 아래라 화면 밖에 생김)
  useEffect(() => {
    if (!hadResultRef.current && results.length > 0) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    hadResultRef.current = results.length > 0;
  }, [results]);

  // 워터마크 출력에 영향을 주는 설정이 바뀌면 이전 결과(다운로드용)는 무효화.
  // (selectedId는 미리보기 대상일 뿐 출력과 무관하므로 제외)
  useEffect(() => {
    setResults([]);
  }, [
    mode, text, fontScale, color, bold, logoDataUrl, logoScale,
    opacity, position, rotation, tile, margin, outputFormat, quality,
    images.length,
  ]);

  const handleFilesAdd = useCallback(async (files: File[]) => {
    const maxBatch = getMaxBatchSize();
    const notices: string[] = [];

    const { valid, oversize, unsupported } = validateImageFiles(files, ACCEPT_IMAGE);
    if (unsupported > 0) notices.push(`${unsupported}개 파일은 지원하지 않는 형식이라 제외했어요.`);
    if (oversize > 0) notices.push(`${oversize}개 파일은 50MB를 넘어 제외했어요.`);

    const loaded = await Promise.all(
      valid.map(async (file): Promise<SourceImage | null> => {
        try {
          const dataUrl = await fileToDataUrl(file);
          const img = await loadImage(dataUrl);
          return {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            dataUrl,
            img,
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
        } catch {
          return null;
        }
      }),
    );
    const newImages = loaded.filter((i): i is SourceImage => i !== null);
    const failed = valid.length - newImages.length;
    if (failed > 0) notices.push(`${failed}개 파일을 열 수 없어 제외했어요.`);

    const room = Math.max(0, maxBatch - imagesRef.current.length);
    const accepted = newImages.slice(0, room);
    const overflow = newImages.length - accepted.length;
    if (overflow > 0) notices.push(`최대 ${maxBatch}개까지 처리할 수 있어 ${overflow}개를 제외했어요.`);

    if (accepted.length > 0) {
      setImages((prev) => {
        const next = [...prev, ...accepted];
        return next;
      });
      setSelectedId((prev) => prev ?? accepted[0].id);
    }

    if (notices.length > 0) {
      setBatchNotice(notices.join(" "));
      setTimeout(() => setBatchNotice(null), 4000);
    }
  }, []);

  const handleRemove = useCallback((id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
    setSelectedId((prev) => {
      if (prev !== id) return prev;
      const rest = imagesRef.current.filter((i) => i.id !== id);
      return rest[0]?.id ?? null;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setImages([]);
    setSelectedId(null);
    setResults([]);
    setError(null);
  }, []);

  const handleLogoUpload = useCallback(async (file: File | undefined) => {
    if (!file) return;
    const { valid } = validateImageFiles([file], LOGO_ACCEPT);
    if (valid.length === 0) {
      setError("로고는 PNG·JPG·WebP 이미지만 가능합니다.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(valid[0]);
      const img = await loadImage(dataUrl);
      setLogoImg(img);
      setLogoDataUrl(dataUrl);
      setLogoName(valid[0].name);
      setError(null);
    } catch {
      setError("로고 이미지를 열 수 없습니다.");
    }
  }, []);

  const handleApply = useCallback(async () => {
    if (images.length === 0 || isProcessing) return;
    if (mode === "text" && !text.trim()) {
      setError("워터마크로 넣을 텍스트를 입력하세요.");
      return;
    }
    if (mode === "logo" && !logoImg) {
      setError("워터마크로 넣을 로고 이미지를 업로드하세요.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const opts = buildOptions();
      const out: { name: string; blob: Blob }[] = [];
      for (const im of images) {
        const format =
          outputFormat === "auto"
            ? autoFormat(im.file)
            : outputFormat;
        const res = await applyWatermark(im.img, { ...opts, outputFormat: format });
        out.push({
          name: createNewFileName(
            im.file.name,
            "_watermark",
            mimeToExtension(res.blob.type),
          ),
          blob: res.blob,
        });
      }
      setResults(out);
      trackToolUse("watermark", { count: images.length, mode, tile });
    } catch (e) {
      setResults([]);
      setError(e instanceof Error ? e.message : "워터마크 처리에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  }, [images, isProcessing, mode, text, logoImg, tile, buildOptions]);

  const tabBtn = (active: boolean) =>
    `flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
      active ? "bg-brand-accent text-white" : "bg-brand-white text-brand-mid hover:text-brand-black"
    }`;

  return (
    <div className="space-y-8">
      {images.length === 0 ? (
        <>
          <FileDropzone
            onFilesSelected={handleFilesAdd}
            accept={ACCEPT_IMAGE}
            multiple
            maxFiles={maxBatchSize}
            maxSize={50 * 1024 * 1024}
          />
          <p className="text-center text-sm text-brand-mid">
            워터마크를 넣을 이미지를 올리세요. 텍스트나 로고를 사진 위에 합성합니다. 여러 장에 같은 워터마크를 한 번에 넣을 수 있어요.
          </p>
        </>
      ) : (
        <>
          {batchNotice && (
            <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg p-3">
              <p className="text-sm text-brand-black">{batchNotice}</p>
            </div>
          )}

          {/* 미리보기 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                미리보기 {images.length > 1 ? `(${images.length}장 중 선택)` : ""}
              </h3>
              <button
                onClick={handleClearAll}
                className="text-sm text-brand-mid hover:text-brand-accent transition-colors"
              >
                전체 삭제
              </button>
            </div>
            <div className="bg-brand-paper rounded-xl p-4 flex justify-center">
              <canvas
                ref={previewRef}
                className="max-w-full max-h-[480px] object-contain rounded"
                aria-label="워터마크 미리보기"
              />
            </div>

            {/* 여러 장이면 썸네일로 미리보기 대상 선택 */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {images.map((img) => (
                  <div key={img.id} className="relative">
                    <button
                      onClick={() => setSelectedId(img.id)}
                      className={`block rounded-md overflow-hidden border-2 transition-colors ${
                        (selectedImg?.id === img.id)
                          ? "border-brand-accent"
                          : "border-transparent hover:border-brand-light"
                      }`}
                      aria-label={`${img.file.name} 미리보기`}
                    >
                      <img
                        src={img.dataUrl}
                        alt={img.file.name}
                        className="w-14 h-14 object-cover bg-brand-white"
                      />
                    </button>
                    <button
                      onClick={() => handleRemove(img.id)}
                      aria-label={`${img.file.name} 삭제`}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-black text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 추가 입력 */}
            {!isProcessing && images.length < maxBatchSize && (
              <label className="block w-full rounded-lg border-2 border-dashed border-brand-light hover:border-brand-accent cursor-pointer py-3 text-center text-sm text-brand-mid hover:text-brand-accent transition-colors">
                <input
                  type="file"
                  accept={ACCEPT_IMAGE}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFilesAdd(Array.from(e.target.files || []));
                    e.target.value = "";
                  }}
                />
                + 이미지 추가
              </label>
            )}
          </div>

          {/* 워터마크 설정 */}
          <div className="bg-brand-paper rounded-xl p-6 space-y-6">
            {/* 종류 탭 */}
            <div className="flex gap-3">
              <button onClick={() => setMode("text")} className={tabBtn(mode === "text")}>
                텍스트
              </button>
              <button onClick={() => setMode("logo")} className={tabBtn(mode === "logo")}>
                로고 이미지
              </button>
            </div>

            {/* 텍스트 옵션 */}
            {mode === "text" ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-black">워터마크 텍스트</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="예: © 내 이름, @아이디"
                    className="w-full px-3 py-2.5 rounded-lg border border-brand-light text-brand-black focus:outline-none focus:border-brand-accent bg-brand-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-brand-black">글자 크기</label>
                      <span className="font-mono text-sm text-brand-accent">{fontScale}%</span>
                    </div>
                    <input
                      type="range" min="2" max="20" value={fontScale}
                      onChange={(e) => setFontScale(Number(e.target.value))}
                      aria-label={`글자 크기 ${fontScale}%`}
                      className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-brand-black">글자 색 / 굵기</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color" value={color}
                        onChange={(e) => setColor(e.target.value)}
                        aria-label="글자 색 선택"
                        className="w-12 h-10 rounded cursor-pointer border border-brand-light bg-brand-white"
                      />
                      <button
                        onClick={() => setBold((b) => !b)}
                        className={`px-4 h-10 rounded-lg text-sm font-bold transition-all ${
                          bold ? "bg-brand-accent text-white" : "bg-brand-white text-brand-mid border border-brand-light"
                        }`}
                      >
                        굵게
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 로고 옵션 */
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-black">로고 이미지</label>
                  <div className="flex items-center gap-3">
                    {logoDataUrl && (
                      <img
                        src={logoDataUrl}
                        alt={logoName ?? "로고"}
                        className="w-12 h-12 object-contain rounded bg-brand-white border border-brand-light"
                      />
                    )}
                    <label className="inline-block rounded-lg border border-brand-light bg-brand-white px-4 py-2.5 text-sm text-brand-mid hover:text-brand-accent hover:border-brand-accent cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept={LOGO_ACCEPT}
                        className="hidden"
                        onChange={(e) => {
                          handleLogoUpload(e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                      {logoDataUrl ? "로고 변경" : "로고 업로드 (투명 PNG 추천)"}
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-brand-black">로고 크기</label>
                    <span className="font-mono text-sm text-brand-accent">{logoScale}%</span>
                  </div>
                  <input
                    type="range" min="5" max="60" value={logoScale}
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    aria-label={`로고 크기 ${logoScale}%`}
                    className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
                </div>
              </div>
            )}

            {/* 위치 (반복이 아닐 때) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-brand-black">위치</label>
                <label className="flex items-center gap-2 text-sm text-brand-mid cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tile}
                    onChange={(e) => setTile(e.target.checked)}
                    className="accent-brand-accent w-4 h-4"
                  />
                  전체 반복 (도용 방지)
                </label>
              </div>
              <div className={`grid grid-cols-3 gap-1.5 w-32 ${tile ? "opacity-40 pointer-events-none" : ""}`}>
                {POSITIONS.map((p) => (
                  <button
                    key={p.v}
                    onClick={() => setPosition(p.v)}
                    aria-label={`위치: ${p.koLabel}`}
                    className={`aspect-square rounded-md text-lg flex items-center justify-center transition-all ${
                      position === p.v
                        ? "bg-brand-accent text-white"
                        : "bg-brand-white text-brand-mid hover:text-brand-black"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 투명도 / 회전 / 여백 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-brand-black">투명도</label>
                  <span className="font-mono text-sm text-brand-accent">{opacity}%</span>
                </div>
                <input
                  type="range" min="5" max="100" value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  aria-label={`투명도 ${opacity}%`}
                  className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-brand-black">회전</label>
                  <span className="font-mono text-sm text-brand-accent">{rotation}°</span>
                </div>
                <input
                  type="range" min="-90" max="90" value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  aria-label={`회전 ${rotation}도`}
                  className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-brand-black">가장자리 여백</label>
                  <span className="font-mono text-sm text-brand-accent">{margin}%</span>
                </div>
                <input
                  type="range" min="0" max="20" value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  aria-label={`여백 ${margin}%`}
                  disabled={tile}
                  className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent disabled:opacity-40"
                />
              </div>
            </div>

            {/* 저장 포맷 + 품질 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-brand-black">저장 포맷</label>
                <div className="flex gap-2">
                  {([
                    { v: "auto", label: "자동" },
                    { v: "image/png", label: "PNG" },
                    { v: "image/jpeg", label: "JPG" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => setOutputFormat(opt.v)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-mono transition-all ${
                        outputFormat === opt.v
                          ? "bg-brand-accent text-white"
                          : "bg-brand-white text-brand-mid hover:text-brand-black"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {outputFormat === "auto" && (
                  <p className="text-xs text-brand-mid leading-relaxed">
                    JPG 사진은 JPG로, WebP는 WebP로, PNG는 투명 배경을 지키도록 PNG로 저장합니다.
                  </p>
                )}
              </div>
              {outputFormat !== "image/png" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-brand-black">저장 품질 (JPG·WebP)</label>
                    <span className="font-mono text-sm text-brand-accent">{quality}%</span>
                  </div>
                  <input
                    type="range" min="1" max="100" value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    aria-label={`저장 품질 ${quality}%`}
                    className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
                </div>
              )}
            </div>

            {/* 적용 버튼 */}
            <button
              onClick={handleApply}
              disabled={isProcessing}
              className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                isProcessing
                  ? "bg-brand-light text-brand-mid cursor-not-allowed"
                  : "bg-brand-accent text-white hover:bg-brand-accent-light"
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  적용하는 중...
                </span>
              ) : results.length > 0 ? (
                "설정 변경 후 다시 적용"
              ) : images.length > 1 ? (
                `${images.length}장에 워터마크 적용`
              ) : (
                "워터마크 적용"
              )}
            </button>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </div>

          {/* 결과 다운로드 */}
          {results.length > 0 && (
            <div ref={resultRef} className="bg-brand-black rounded-xl p-6 space-y-5 text-center scroll-mt-4">
              <p className="text-brand-paper">
                워터마크 적용 완료 —{" "}
                <span className="font-mono text-brand-accent">{results.length}장</span>
              </p>
              <div className="flex justify-center">
                {results.length === 1 ? (
                  <DownloadButton
                    tool="watermark"
                    fileName={results[0].name}
                    fileBlob={results[0].blob}
                    variant="primary"
                    size="lg"
                    label="다운로드"
                  />
                ) : (
                  <DownloadButton
                    tool="watermark"
                    files={results}
                    zipFileName="floor05-watermark-images.zip"
                    variant="primary"
                    size="lg"
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
