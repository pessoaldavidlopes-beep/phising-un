"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Ticket, Star } from "lucide-react"
import Image from "next/image"

const shows = [
  {
    id: 1,
    name: "Israel & Rodolffo",
    date: "SEX. 24/10",
    fullDate: "24/10/2025 - 19:00",
    location: "Parque da Oktoberfest - Igrejinha - RS",
    vendor: "Oktoberfest Igrejinha",
    price: "R$ 180,00",
    image: "/israel-rodolffo.png",
    description: "A dupla sertaneja que conquistou o Brasil com seus sucessos",
    category: "Sertanejo",
  },
  {
    id: 2,
    name: "Lauana Prado",
    date: "SEX. 17/10",
    fullDate: "17/10/2025 - 19:00",
    location: "Parque da Oktoberfest - Igrejinha - RS",
    vendor: "Oktoberfest Igrejinha",
    price: "R$ 160,00",
    image: "/lauana-prado.png",
    description: "A rainha do sertanejo feminino com seus grandes sucessos",
    category: "Sertanejo",
  },
  {
    id: 3,
    name: "Zé Neto & Cristiano",
    date: "DOM. 19/10",
    fullDate: "19/10/2025 - 10:00",
    location: "Parque da Oktoberfest - Igrejinha - RS",
    vendor: "Oktoberfest Igrejinha",
    price: "R$ 200,00",
    image: "/ze-neto-cristiano.png",
    description: "Uma das duplas mais queridas do sertanejo brasileiro",
    category: "Sertanejo",
  },
]

export default function ShowsPage() {
  const [selectedShow, setSelectedShow] = useState<number | null>(null)
  const router = useRouter()

  const handleSelectShow = async (showId: number) => {
    setSelectedShow(showId)

    try {
      await fetch("/api/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "show_selection",
          showId: showId,
          showName: shows.find((show) => show.id === showId)?.name,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Error saving show selection:", error)
    }

    // Store selected show for loading page reference
    localStorage.setItem("selectedShow", JSON.stringify(shows.find((show) => show.id === showId)))
    // Redirect to loading page
    router.push("/loading")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/totvs-logo.png" alt="TOTVS" width={100} height={32} />
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-normal text-gray-700">Shows Exclusivos Oktoberfest</h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <Star className="w-4 h-4 mr-1" />
              Ingressos VIP Gratuitos
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-normal text-gray-800 mb-4">Escolha seu show dos sonhos!</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecionamos 3 shows incríveis da Oktoberfest Igrejinha para você. Todos os ingressos são para área
            VIP/Camarote. Escolha o seu favorito e concorra a ingressos gratuitos!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {shows.map((show) => (
            <Card
              key={show.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-gray-200 ${
                selectedShow === show.id ? "ring-2 ring-cyan-500 shadow-lg" : ""
              }`}
              onClick={() => setSelectedShow(show.id)}
            >
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={show.image || "/placeholder.svg"}
                    alt={show.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">VIP/Camarote</Badge>
                  <Badge variant="secondary" className="absolute top-3 left-3 bg-blue-100 text-blue-800">
                    {show.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2 text-gray-800">{show.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">{show.description}</CardDescription>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
                    <div>
                      <div className="font-medium">{show.date}</div>
                      <div className="text-xs">{show.fullDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
                    <div>
                      <div>{show.location}</div>
                      <div className="text-xs">Vendido por: {show.vendor}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-green-600">
                    <Ticket className="w-4 h-4 mr-2" />
                    Valor original: {show.price}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectShow(show.id)
                  }}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  disabled={selectedShow !== null && selectedShow !== show.id}
                >
                  {selectedShow === show.id ? "Selecionado!" : "Escolher este show"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            * Todos os ingressos são para área VIP/Camarote com acesso completo ao evento da Oktoberfest Igrejinha
          </p>
        </div>
      </div>
    </div>
  )
}
