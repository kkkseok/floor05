/**
 * 리사이즈 목표 치수 계산 (DOM 비의존 순수 함수).
 * resizeImage(메인 스레드)와 이미지 워커가 공유하는 단일 소스.
 */

export interface ResizeDimsOptions {
  width: number;
  height: number;
  maintainAspectRatio?: boolean;
}

export function computeResizeDimensions(
  naturalWidth: number,
  naturalHeight: number,
  options: ResizeDimsOptions
): { width: number; height: number } {
  const { width, height, maintainAspectRatio = true } = options;

  let newWidth = width;
  let newHeight = height;

  if (maintainAspectRatio) {
    const aspectRatio = naturalWidth / naturalHeight;

    if (height === 0 || height === undefined) {
      // 너비만 지정된 경우
      newHeight = Math.round(width / aspectRatio);
    } else if (width === 0 || width === undefined) {
      // 높이만 지정된 경우
      newWidth = Math.round(height * aspectRatio);
    } else {
      // 둘 다 지정된 경우: fit 방식
      const targetRatio = width / height;
      if (aspectRatio > targetRatio) {
        newWidth = width;
        newHeight = Math.round(width / aspectRatio);
      } else {
        newHeight = height;
        newWidth = Math.round(height * aspectRatio);
      }
    }
  }

  return { width: newWidth, height: newHeight };
}

/**
 * 정해진 크기(SNS 프리셋 등)를 채우도록 가운데를 잘라 맞춘다(cover).
 * 비율이 다른 사진을 그 크기로 늘리면 찌그러지므로, 원본에서 목표 비율만큼 가운데를 잘라 쓴다.
 * noEnlarge면 잘라낸 영역이 목표보다 작을 때 확대하지 않고 같은 비율로 작게 낸다.
 */
export function computeCoverCrop(
  naturalWidth: number,
  naturalHeight: number,
  width: number,
  height: number,
  noEnlarge = false
): { sx: number; sy: number; sw: number; sh: number; width: number; height: number } {
  const target = width / height;
  let sw = naturalWidth;
  let sh = naturalHeight;
  if (naturalWidth / naturalHeight > target) sw = naturalHeight * target;
  else sh = naturalWidth / target;
  const scale = noEnlarge ? Math.min(1, sw / width) : 1;
  return {
    sx: (naturalWidth - sw) / 2,
    sy: (naturalHeight - sh) / 2,
    sw,
    sh,
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
