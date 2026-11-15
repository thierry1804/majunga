import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BaobabScene from '../motion/BaobabScene'

interface AuthLayoutProps {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

/** Mise en page commune des pages d'accès à l'espace équipe : connexion, mot de passe oublié, nouveau mot de passe. */
export default function AuthLayout({ title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-sand-50 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Panneau de marque : grand écran uniquement */}
      <aside className="relative hidden overflow-hidden bg-ocean-900 lg:block" aria-hidden="true">
        <BaobabScene className="absolute inset-0 h-full w-full" />
        <div className="relative flex flex-col gap-8 p-12 text-sand-50">
          <span className="font-display text-3xl font-semibold tracking-[-0.02em]">
            Mada<span className="text-terracotta-400">Booking</span>
          </span>
          <p className="max-w-sm font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-balance">
            Les circuits et les navettes de Majunga, gérés au même endroit.
          </p>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink lg:invisible"
          >
            Mada<span className="text-terracotta-500">Booking</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md text-sm text-ink-muted transition-colors hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Retour au site
          </Link>
        </div>

        <div className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-md">
            <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
              {title}
            </h1>
            {description && <p className="mt-3 text-base leading-relaxed text-ink-muted">{description}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 text-sm text-ink-light">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  )
}
