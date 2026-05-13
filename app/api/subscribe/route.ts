import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    // Get the Google Apps Script Web App URL from environment variable
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      console.error("GOOGLE_SCRIPT_URL is not configured");
      return NextResponse.json(
        { error: "Configuration manquante" },
        { status: 500 }
      );
    }

    // Send data to Google Apps Script
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        date: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save to Google Sheets");
    }

    return NextResponse.json(
      { message: "Inscription réussie" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in subscribe API:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
