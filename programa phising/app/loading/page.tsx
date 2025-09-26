"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, X, Frown } from "lucide-react"
import Image from "next/image"

export default function LoadingPage() {
  const [stage, setStage] = useState<"loading" | "result">("loading")
  const [selectedShow, setSelectedShow] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get selected show from localStorage
    const show = localStorage.getItem("selectedShow")
    if (show) {
      setSelectedShow(JSON.parse(show))
    }

    // Simulate loading process
    const timer = setTimeout(() => {
      setStage("result")
    }, 4000) // 4 seconds of loading

    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    router.push("/final-form")
  }

  if (stage === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Image src="/totvs-logo.png" alt="TOTVS" width={100} height={32} />
              </div>
              <CardTitle className="text-2xl text-gray-800">Processando sua solicitação...</CardTitle>
              <CardDescription className="text-gray-600">
                Estamos verificando a disponibilidade dos ingressos para{" "}
                <span className="font-semibold text-blue-600">{selectedShow?.name}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Verificando disponibilidade...</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Consultando sistema de ingressos...</span>
                  <span className="text-green-600 font-medium">✓</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Processando sua reserva...</span>
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Aguarde:</strong> Este processo pode levar alguns segundos devido à alta demanda pelos
                  ingressos VIP.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card className="text-center border-red-200">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-600 flex items-center justify-center gap-2">
              <Frown className="w-6 h-6" />
              Ops! Ingressos Esgotados
            </CardTitle>
            <CardDescription className="text-gray-700 text-base">
              Infelizmente esses ingressos já acabaram <span className="text-red-600 font-medium text-lg">:(</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">Show selecionado:</h3>
              <p className="text-red-700">
                <strong>{selectedShow?.name}</strong>
              </p>
              <p className="text-sm text-red-600 mt-1">{selectedShow?.date}</p>
              <p className="text-sm text-red-600">{selectedShow?.location}</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Não desista!</h3>
              <p className="text-sm text-blue-700">
                Deixe seus dados e te avisaremos assim que novos ingressos VIP ficarem disponíveis para este ou outros
                shows incríveis.
              </p>
            </div>

            <Button onClick={handleContinue} className="w-full bg-blue-600 hover:bg-blue-700 py-3">
              Quero ser avisado sobre novos ingressos
            </Button>

            <p className="text-xs text-gray-500">
              * Você receberá notificações exclusivas sobre disponibilidade de ingressos VIP
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
