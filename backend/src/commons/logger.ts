import { ConsoleLogger, Injectable } from '@nestjs/common';

export interface LogMetadata {
  teamId?: string;
  teamName?: string;
  [key: string]: unknown;
}

@Injectable()
export class CustomLogger extends ConsoleLogger {
  override log(message: unknown, ...optionalParams: unknown[]): void {
    const { context, metadata } = this.getDetails(optionalParams);

    super.log(this.formatCustomMessage(message, metadata), context);
  }

  override fatal(message: unknown, ...optionalParams: unknown[]): void {
    const { context, metadata } = this.getDetails(optionalParams);

    super.fatal(this.formatCustomMessage(message, metadata), context);
  }

  override error(message: unknown, ...optionalParams: unknown[]): void {
    const { context, metadata, stack } = this.getDetails(optionalParams);

    super.error(this.formatCustomMessage(message, metadata), stack, context);
  }

  override warn(message: unknown, ...optionalParams: unknown[]): void {
    const { context, metadata } = this.getDetails(optionalParams);

    super.warn(this.formatCustomMessage(message, metadata), context);
  }

  override debug(message: unknown, ...optionalParams: unknown[]): void {
    const { context, metadata } = this.getDetails(optionalParams);

    super.debug(this.formatCustomMessage(message, metadata), context);
  }

  override verbose(message: unknown, ...optionalParams: unknown[]): void {
    const { context, metadata } = this.getDetails(optionalParams);

    super.verbose(this.formatCustomMessage(message, metadata), context);
  }

  private getDetails(optionalParams: unknown[]): {
    context?: string;
    metadata: LogMetadata;
    stack?: string;
  } {
    const metadata =
      optionalParams.find(
        (param): param is LogMetadata =>
          typeof param === 'object' &&
          param !== null &&
          !Array.isArray(param),
      ) ?? {};
    const strings = optionalParams.filter(
      (param): param is string => typeof param === 'string',
    );

    return {
      context: strings.at(-1),
      metadata,
      stack: strings.length > 1 ? strings[0] : undefined,
    };
  }

  private formatCustomMessage(message: unknown, metadata: LogMetadata): string {
    const formattedMessage =
      message instanceof Error
        ? message.message
        : typeof message === 'string'
          ? message
          : (JSON.stringify(message) ?? String(message));
    const details = Object.entries(metadata)
      .map(([key, value]) => `${key}=${String(value)}`)
      .join(' ');

    return `[${this.getBrasiliaTime()}] ${formattedMessage}${
      details ? ` ${details}` : ''
    }`;
  }

  private getBrasiliaTime(): string {
    return new Intl.DateTimeFormat('sv-SE', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date());
  }
}
