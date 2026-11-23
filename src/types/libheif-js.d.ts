// libheif-js(1.23.5)의 ES 모듈 번들에서 floor05가 쓰는 부분만 선언한다.
// 원본 타입(libheif-wasm/libheif.d.ts)은 저수준 함수 전체를 담고 있어 여기서 필요한 것만 좁힌다.
declare module "libheif-js/libheif-wasm/libheif-bundle.mjs" {
  export interface HeifImage {
    get_width(): number;
    get_height(): number;
    display(
      target: { data: Uint8ClampedArray; width: number; height: number },
      callback: (result: { data: Uint8ClampedArray; width: number; height: number } | null) => void,
    ): void;
    free(): void;
  }

  export interface HeifDecoder {
    /** 실패하면 빈 배열을 돌려준다(예외를 던지지 않음). */
    decode(data: Uint8Array): HeifImage[];
    /** 내부 heif_context 포인터. 다음 decode 전까지 해제되지 않으므로 직접 해제한다. */
    decoder: number | null;
  }

  export interface LibheifModule {
    HeifDecoder: new () => HeifDecoder;
    heif_context_free(context: number): void;
  }

  const factory: () => LibheifModule;
  export default factory;
}
