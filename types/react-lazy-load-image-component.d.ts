declare module 'react-lazy-load-image-component' {
  import { ImgHTMLAttributes } from 'react';

  export interface LazyLoadImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt?: string;
    effect?: string;
    placeholder?: React.ReactNode;
    placeholderSrc?: string;
    threshold?: number;
    visibleByDefault?: boolean;
    wrapperClassName?: string;
    wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
    scrollPosition?: { x: number; y: number };
    delayMethod?: 'debounce' | 'throttle';
    delayTime?: number;
    onLoad?: () => void;
    onError?: () => void;
    beforeLoad?: () => void;
    afterLoad?: () => void;
  }

  export class LazyLoadImage extends React.Component<LazyLoadImageProps> {}
  
  export const LazyLoadImage: React.FC<LazyLoadImageProps>;
}

