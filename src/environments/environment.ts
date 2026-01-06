// Environment Configuration - Development
// Este archivo se usa para configuración de desarrollo

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiTimeout: 30000, // 30 segundos
  
  // Autenticación
  auth: {
    endpoint: 'http://localhost:8080/api/auth',
    tokenKey: 'auth_token',
    userKey: 'user_info'
  },

  // Mensajes
  messages: {
    invalidCredentials: 'Email o contraseña incorrectos',
    emailAlreadyRegistered: 'El email ya está registrado',
    invalidVerificationCode: 'Código de verificación inválido',
    weakPassword: 'La contraseña es muy débil',
    networkError: 'Error de conexión. Intenta nuevamente',
    serverError: 'Error del servidor. Intenta más tarde'
  },

  // Validaciones
  validation: {
    passwordMinLength: 8,
    passwordRequirements: {
      uppercase: true,
      lowercase: true,
      numbers: true
    },
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    nameMinLength: 2,
    verificationCodeLength: 6
  },

  // Estilos
  theme: {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    successColor: '#48bb78',
    errorColor: '#f56565',
    warningColor: '#ed8936',
    infoColor: '#4299e1'
  }
};
