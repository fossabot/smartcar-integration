import { Decoder } from "io-ts";

export interface DecodeDataOptions<I, A = unknown> {
  decoder: Decoder<I, A>;
  data: any;
  dtoName: string;
  printData?: boolean;
}

export function decodeData<I, A = unknown>(options: DecodeDataOptions<I, A>): A {
  const { decoder, data, dtoName, printData } = options;
  const parsed = decoder.decode(data);

  const dtoNameFragment = dtoName ? ` ${dtoName}` : "";
  const printDataFragment = printData ? `: ${data}` : "";
  if (parsed.isLeft()) throw new Error(`failed to decode${dtoNameFragment}${printDataFragment}`);
  return parsed.value;
}
