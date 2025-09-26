import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (data.type === "final_form") {
      return NextResponse.json({
        success: true,
        message: "Dados registrados com sucesso!",
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar dados:", error)
    return NextResponse.json({ error: "Falha ao processar dados" }, { status: 500 })
  }
}
