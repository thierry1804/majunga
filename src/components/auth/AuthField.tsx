import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: LucideIcon
  /** Élément aligné à droite de l'intitulé, par exemple le lien « Mot de passe oublié ? ». */
  labelAside?: ReactNode
}

const inputClass = 'field-input py-3 text-base pl-10'

/** Champ de formulaire des pages d'accès : intitulé, icône et saisie. */
export function AuthField({ id, label, icon: Icon, labelAside, className = '', ...props }: AuthFieldProps) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="field-label !mb-0">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-light"
          aria-hidden="true"
        />
        <input id={id} className={`${inputClass} ${className}`} {...props} />
      </div>
    </div>
  )
}

/** Champ mot de passe avec bouton pour afficher ou masquer la saisie. */
export function PasswordField({ id, label, icon: Icon, labelAside, className = '', ...props }: AuthFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="field-label !mb-0">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-light"
          aria-hidden="true"
        />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className={`${inputClass} pr-12 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          aria-pressed={visible}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-ink-light transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
