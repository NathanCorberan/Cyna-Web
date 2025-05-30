"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  CreditCard,
  Download,
  Shield,
  Star,
  Zap,
  TrendingUp,
  MoreVertical,
  ArrowRight,
} from "lucide-react"

import { useMySubscriptions } from "@/hooks/subscriptions/useMySubscriptions"
import type { MySubOutputDto } from "@/types/subscription"

const formatDate = (isoDate?: string | null) =>
  isoDate
    ? new Date(isoDate).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—"

const getSubscriptionIcon = (title: string) => {
  const lower = title.toLowerCase()
  if (lower.includes("premium") || lower.includes("pro")) return Star
  if (lower.includes("basic") || lower.includes("standard")) return Shield
  if (lower.includes("enterprise") || lower.includes("business")) return TrendingUp
  return Zap
}

function getPeriodLabel(type?: string) {
  if (!type) return ""
  if (type.toLowerCase() === "monthly") return "par mois"
  if (type.toLowerCase() === "yearly") return "par an"
  if (type.toLowerCase() === "lifetime") return "à vie"
  return ""
}

export default function AbonnementsPage() {
  const { subscriptions, loading } = useMySubscriptions()
  // Filtrer UNIQUEMENT les abonnements actifs ici !
  const subs = subscriptions.filter(sub => sub.status === "available")

  const totalMonthlySpend = subs.reduce((sum, sub) => sum + (sub.price ?? 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#302082] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de vos abonnements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-[#302082] to-[#4030a0] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Mes Abonnements</h1>
          <div className="flex justify-center gap-8 max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1">
              <div className="text-2xl font-bold">{subs.length}</div>
              <div className="text-sm opacity-90">Abonnements actifs</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex-1">
              <div className="text-2xl font-bold">{totalMonthlySpend.toFixed(2)} €</div>
              <div className="text-sm opacity-90">Dépense mensuelle</div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 max-w-4xl mx-auto">
          {subs.map((subscription) => {
            const SubscriptionIcon = getSubscriptionIcon(subscription.productTitle || "")

            return (
              <Card
                key={subscription.id}
                className="overflow-hidden shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Header toujours bleu */}
                <div className="bg-gradient-to-r from-[#302082] to-[#4030a0] p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        <SubscriptionIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{subscription.productTitle}</h3>
                        <p className="text-white/80 text-sm">{subscription.productDescription?.split("*")[0]}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{subscription.price} €</div>
                      <div className="text-white/80 text-sm">
                        {getPeriodLabel(subscription.type)}
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <Badge variant="default" className="flex items-center gap-2 px-3 py-1 bg-[#302082] text-white">
                      Actif
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Informations détaillées */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-[#302082]/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-[#302082]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Date de début</div>
                          <div className="text-sm text-gray-600">{formatDate(subscription.startDate)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-[#302082]/10 p-2 rounded-full">
                          <Calendar className="h-5 w-5 text-[#302082]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Date de fin</div>
                          <div className="text-sm text-gray-600">{formatDate(subscription.endDate)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-[#302082]/10 p-2 rounded-full">
                          <Shield className="h-5 w-5 text-[#302082]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Type d'abonnement</div>
                          <div className="text-sm text-gray-600">
                            {subscription.type === "Monthly" && "Mensuel"}
                            {subscription.type === "Yearly" && "Annuel"}
                            {subscription.type?.toLowerCase() === "lifetime" && "À vie"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-[#302082]/10 p-2 rounded-full">
                          <CreditCard className="h-5 w-5 text-[#302082]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Facturation</div>
                          <div className="text-sm text-gray-600">Automatique</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-[#302082]/5 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Factures
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* État vide */}
        {subs.length === 0 && (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-gradient-to-br from-[#302082] to-[#4030a0] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Aucun abonnement actif</h3>
            <p className="text-gray-600 mb-8">Découvrez nos services et trouvez l'abonnement qui vous convient.</p>
            <a href="/produits">
              <Button className="bg-gradient-to-r from-[#302082] to-[#4030a0] hover:from-[#3a2a9d] hover:to-[#4a3ab0] text-white px-8 py-3">
                Découvrir nos services
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </a>
          </div>
        )}

        {/* Boutons d'action en bas */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-16">
          <a href="/produits">
            <Button
              variant="outline"
              className="px-8 py-3 text-base font-medium hover:bg-[#302082]/5 transition-colors"
            >
              Découvrir d'autres services
            </Button>
          </a>
          <a href="/account">
            <Button className="px-8 py-3 text-base font-medium bg-gradient-to-r from-[#302082] to-[#4030a0] hover:from-[#3a2a9d] hover:to-[#4a3ab0] text-white transition-all">
              Mon compte
            </Button>
          </a>
        </div>
      </main>
    </div>
  )
}
