import { signal } from '@angular/core';

export interface LoadOptions {
  forceError?: boolean;
}

export interface LoadableState {
  readonly isLoading: () => boolean;
  readonly error: () => string | null;
  load(options?: LoadOptions): void;
}

/**
 * Encapsula el patrón loading/error con latencia simulada, reutilizable por
 * cualquier store que necesite comportarse como si consumiera una API real
 * (mismo patrón que usaremos en Fase C con HttpClient, sin tener que cambiarlo).
 */
export function createLoadableState(errorMessage: string, delayMs = 600): LoadableState {
  const loading = signal(false);
  const loadError = signal<string | null>(null);

  return {
    isLoading: loading.asReadonly(),
    error: loadError.asReadonly(),
    load(options?: LoadOptions): void {
      loading.set(true);
      loadError.set(null);

      setTimeout(() => {
        if (options?.forceError) {
          loadError.set(errorMessage);
          loading.set(false);
          return;
        }
        loading.set(false);
      }, delayMs);
    },
  };
}
