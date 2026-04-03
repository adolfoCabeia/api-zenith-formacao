declare module 'pdfkit' {
  import { Readable } from 'stream';

  interface PDFDocumentOptions {
    size?: string | [number, number];
    margin?: number;
    margins?: { top: number; bottom: number; left: number; right: number };
    layout?: 'portrait' | 'landscape';
    [key: string]: any;
  }

  interface TextOptions {
    align?: 'left' | 'center' | 'right' | 'justify';
    width?: number;
    height?: number;
    columns?: number;
    columnGap?: number;
    indent?: number;
    paragraphGap?: number;
    lineGap?: number;
    wordSpacing?: number;
    characterSpacing?: number;
    fill?: boolean;
    stroke?: boolean;
    link?: string;
    underline?: boolean;
    strike?: boolean;
    continued?: boolean;
    [key: string]: any;
  }

  class PDFDocument extends Readable {
    constructor(options?: PDFDocumentOptions);
    text(text: string, x?: number, y?: number, options?: TextOptions): this;
    text(text: string, options?: TextOptions): this;
    fontSize(size: number): this;
    font(font: string): this;
    moveDown(lines?: number): this;
    moveUp(lines?: number): this;
    moveTo(x: number, y: number): this;
    lineTo(x: number, y: number): this;
    stroke(): this;
    fill(): this;
    image(src: string | Buffer, x?: number, y?: number, options?: any): this;
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean }): T;
    end(): void;
    save(): this;
    restore(): this;
    scale(x: number, y?: number): this;
    rotate(angle: number, options?: { origin?: [number, number] }): this;
    translate(x: number, y: number): this;
    info: {
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
      CreationDate?: Date;
      ModDate?: Date;
      Creator?: string;
      Producer?: string;
    };
  }

  export = PDFDocument;
}