import { NextRequest, NextResponse } from "next/server";
import { MyanmarVedicTimeConverter } from "../../lib/time-converter";

export async function POST(request: NextRequest) {
  try {
    const { birthInfo, coordInput } = await request.json();

    const converter = new MyanmarVedicTimeConverter();
    const location = converter.convertCoordinates(coordInput);
    const result = converter.fullConversion(birthInfo, location);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Time conversion error:", error);
    return NextResponse.json(
      { error: "Failed to calculate time conversion" },
      { status: 500 }
    );
  }
}
