// ============================================================================
// Zipayo Environment Variables Check
// Warns on startup if placeholder keys are active
// ============================================================================

interface EnvConfig {
  key: string
  required: boolean
  description: string
  placeholder?: string[]
}

const ENV_CONFIGS: EnvConfig[] = [
  {
    key: 'DATABASE_URL',
    required: true,
    description: 'PostgreSQL connection string',
    placeholder: ['postgres://user:password@localhost:5432/db', 'your-database-url'],
  },
  {
    key: 'NEXTAUTH_SECRET',
    required: true,
    description: 'NextAuth.js secret for JWT signing',
    placeholder: ['your-secret-here', 'change-me', 'secret'],
  },
  {
    key: 'NEXTAUTH_URL',
    required: true,
    description: 'NextAuth.js URL',
    placeholder: ['http://localhost:3000'],
  },
  {
    key: 'STRIPE_SECRET_KEY',
    required: true,
    description: 'Stripe API secret key',
    placeholder: ['sk_test_', 'sk_live_your-key-here'],
  },
  {
    key: 'STRIPE_PUBLISHABLE_KEY',
    required: true,
    description: 'Stripe publishable key',
    placeholder: ['pk_test_', 'pk_live_your-key-here'],
  },
  {
    key: 'STRIPE_WEBHOOK_SECRET',
    required: true,
    description: 'Stripe webhook signing secret',
    placeholder: ['whsec_your-secret-here'],
  },
  {
    key: 'RESEND_API_KEY',
    required: false,
    description: 'Resend API key for emails',
    placeholder: ['re_your-key-here'],
  },
  {
    key: 'ZIPAYO_PLATFORM_FEE_PERCENT',
    required: false,
    description: 'Platform fee percentage (default: 1.4)',
  },
]

interface CheckResult {
  key: string
  status: 'ok' | 'missing' | 'placeholder'
  message: string
}

export function checkEnvironmentVariables(): CheckResult[] {
  const results: CheckResult[] = []

  for (const config of ENV_CONFIGS) {
    const value = process.env[config.key]

    if (!value) {
      if (config.required) {
        results.push({
          key: config.key,
          status: 'missing',
          message: `Missing required env var: ${config.key} (${config.description})`,
        })
      }
      continue
    }

    // Check for placeholder values
    if (config.placeholder) {
      const isPlaceholder = config.placeholder.some(p => 
        value.toLowerCase().includes(p.toLowerCase()) ||
        value === p
      )
      
      if (isPlaceholder) {
        results.push({
          key: config.key,
          status: 'placeholder',
          message: `⚠️  ${config.key} appears to be a placeholder value`,
        })
        continue
      }
    }

    results.push({
      key: config.key,
      status: 'ok',
      message: `${config.key} is set`,
    })
  }

  return results
}

export function logEnvironmentWarnings(): void {
  const results = checkEnvironmentVariables()
  
  const warnings = results.filter(r => r.status !== 'ok')
  
  if (warnings.length === 0) {
    console.log('✅ All environment variables are properly configured')
    return
  }

  console.log('\n⚠️  Zipayo Environment Check:')
  console.log('=' .repeat(50))
  
  for (const warning of warnings) {
    if (warning.status === 'missing') {
      console.error(`❌ ${warning.message}`)
    } else if (warning.status === 'placeholder') {
      console.warn(`⚠️  ${warning.message}`)
    }
  }
  
  console.log('=' .repeat(50))
  console.log('')
}

// Auto-run on module load in development
if (process.env.NODE_ENV === 'development') {
  logEnvironmentWarnings()
}
