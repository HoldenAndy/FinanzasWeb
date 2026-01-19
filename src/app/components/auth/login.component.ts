import { Component, inject, HostListener, ElementRef, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule, Brain, Menu, X, ArrowRight, Check, Shield, Rocket, Coins, Receipt, Users, Calendar, Globe, Puzzle, ClipboardList, CheckCircle, Bell, Eye, EyeOff, Mail, Cookie, MessageCircle, FileText, ShieldCheck, CreditCard, ScrollText, Award, LogIn, UserPlus, LayoutDashboard, PiggyBank, TrendingUp, BarChart3 } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { gsap } from 'gsap';

// Tipos para el estado del login
type AuthMode = 'login' | 'register' | 'forgot-password' | 'verify-code' | 'new-password' | 'success';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, ScrollRevealDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private el = inject(ElementRef);

  // --- ICONOS (Para usar en HTML) ---
  readonly icons = { Brain, Menu, X, ArrowRight, Check, Shield, Rocket, Coins, Receipt, Users, Calendar, Globe, Puzzle, ClipboardList, CheckCircle, Bell, Eye, EyeOff, Mail, Cookie, MessageCircle, FileText, ShieldCheck, CreditCard, ScrollText, Award, LogIn, UserPlus, LayoutDashboard, PiggyBank, TrendingUp, BarChart3 };

  // --- ESTADO DE LA LANDING PAGE ---
  isMenuOpen = false;
  isYearly = false; // Toggle de precios
  activeTab = 'dashboard'; // Tab de features
  isHeaderCompact = false;
  private featureHoverListenersSetup = false;

  // ViewChild para el carrusel de temas
  @ViewChild('themeCarousel') themeCarousel?: ElementRef;

  // Array de imágenes de temas
  themeImages = [
    '/assets/images/theme-1.png',
    '/assets/images/theme-2.png',
    '/assets/images/theme-3.png',
    '/assets/images/theme-4.png',
    '/assets/images/theme-5.png',
    '/assets/images/theme-6.png',
    '/assets/images/theme-7.png',
    '/assets/images/theme-8.png',
    '/assets/images/theme-9.png',
    '/assets/images/theme-10.png'
  ];

  // --- ESTADO DEL MODAL ---
  showPassword = false;
  rememberMe = true;
  termsAccepted = false;

  private headerTimeline?: gsap.core.Timeline;

  ngAfterViewInit() {
    this.setupHeaderAnimation();
    this.setupThemeCarousel();
    this.setupHoverEffects();
  }

  ngOnDestroy() {
    this.headerTimeline?.kill();
  }

  private setupThemeCarousel() {
    if (!this.themeCarousel) return;

    const carousel = this.themeCarousel.nativeElement;
    const items = carousel.querySelectorAll('.carousel-item');
    
    if (items.length === 0) return;

    // Calculamos el ancho total de la primera mitad de las imágenes
    const totalWidth = Array.from(items).slice(0, this.themeImages.length).reduce((acc: number, item: any) => {
      return acc + item.offsetWidth + 16; // 16px es el gap
    }, 0);

    // Animación infinita seamless
    gsap.set(carousel, { x: 0 });
    
    gsap.to(carousel, {
      x: -totalWidth,
      duration: 10,
      ease: 'none',
      repeat: -1,
      onRepeat: () => {
        // Reiniciamos la posición sin transición para loop seamless
        gsap.set(carousel, { x: 0 });
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollY = window.scrollY;
    const header = this.el.nativeElement.querySelector('header');
    
    if (scrollY > 100 && !this.isHeaderCompact) {
      this.isHeaderCompact = true;
      this.animateHeaderCompact(header, true);
    } else if (scrollY <= 100 && this.isHeaderCompact) {
      this.isHeaderCompact = false;
      this.animateHeaderCompact(header, false);
    }
  }

  private setupHeaderAnimation() {
    const header = this.el.nativeElement.querySelector('header');
    const innerContainer = header.querySelector('.header-inner');
    
    // Animación de hover con efecto elástico
    innerContainer?.addEventListener('mouseenter', () => {
      if (this.isHeaderCompact) {
        gsap.to(innerContainer, {
          scale: 1.05,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    });

    innerContainer?.addEventListener('mouseleave', () => {
      gsap.to(innerContainer, {
        scale: 1,
        duration: 0.4,
        ease: 'back.out(1.5)'
      });
    });
  }

  private animateHeaderCompact(header: any, compact: boolean) {
    const innerContainer = header.querySelector('.header-inner');
    const container = header.querySelector('.header-container');
    const logo = header.querySelector('.header-logo');
    const button = header.querySelector('.header-button');

    if (compact) {
      // Establecer display inline-flex primero para que el ancho se adapte al contenido de inmediato
      gsap.set(innerContainer, { 
        display: 'inline-flex',
        width: 'auto'
      });
      
      // Animación suave con efecto elástico hacia la píldora
      gsap.to(innerContainer, {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        webkitBackdropFilter: 'blur(20px)',
        backdropFilter: 'blur(20px)',
        borderRadius: '40px',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        duration: 1,
        ease: 'elastic.out(1, 0.6)'
      });
      
      gsap.to(container, {
        justifyContent: 'center',
        gap: '2.5rem',
        duration: 0.9,
        ease: 'back.out(1.7)'
      });
      
      gsap.to([logo, button], {
        scale: 0.92,
        duration: 0.9,
        ease: 'back.out(2)'
      });
      
    } else {
      // Animación de vuelta con efecto suave
      gsap.to(innerContainer, {
        backgroundColor: 'transparent',
        webkitBackdropFilter: 'none',
        backdropFilter: 'none',
        borderRadius: '0',
        display: 'block',
        width: '100%',
        paddingLeft: '0',
        paddingRight: '0',
        border: 'none',
        duration: 0.8,
        ease: 'power2.inOut'
      });
      
      gsap.to(container, {
        justifyContent: 'space-between',
        gap: '0',
        duration: 0.8,
        ease: 'power2.inOut'
      });
      
      gsap.to([logo, button], {
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.5)'
      });
    }
  }

  private setupHoverEffects() {
    // 1. Enlaces del header (Características y Precios)
    const headerLinks = this.el.nativeElement.querySelectorAll('header nav a');
    headerLinks.forEach((link: any) => {
      link.addEventListener('mouseenter', () => {
        gsap.to(link, { backgroundColor: '#2C2C2C', duration: 0.3, ease: 'power2.out' });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(link, { backgroundColor: 'transparent', duration: 0.3, ease: 'power2.out' });
      });
    });

    // 2. Botones inactivos de la barra de features
    this.setupFeatureButtonsHover();

    // 3. Botones del footer
    const footerButtons = this.el.nativeElement.querySelectorAll('footer button');
    footerButtons.forEach((btn: any) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { backgroundColor: '#2C2C2C', duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { backgroundColor: 'transparent', duration: 0.3, ease: 'power2.out' });
      });
    });

    // 4. Tarjetas de precios (Básico, Autónomo, Clínica)
    const pricingCards = this.el.nativeElement.querySelectorAll('#precios .bg-card');
    pricingCards.forEach((card: any) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.05, duration: 0.4, ease: 'back.out(1.7)' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
      });
    });
  }

  private setupFeatureButtonsHover() {
    if (this.featureHoverListenersSetup) return;
    this.featureHoverListenersSetup = true;
    
    const featureButtons = this.el.nativeElement.querySelectorAll('.feature-tab-button');
    featureButtons.forEach((btn: any) => {
      btn.addEventListener('mouseenter', () => {
        // Verificar si es el botón activo usando la clase
        const isActive = btn.classList.contains('text-black');
        if (!isActive) {
          gsap.to(btn, { backgroundColor: '#2C2C2C', duration: 0.3, ease: 'power2.out' });
        }
      });
      btn.addEventListener('mouseleave', () => {
        const isActive = btn.classList.contains('text-black');
        if (!isActive) {
          gsap.to(btn, { backgroundColor: '#000000', duration: 0.3, ease: 'power2.out' });
        }
      });
    });
  }

  // Datos de Features (Adaptados a Fintech)
  featuresData = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      title: "Visión 360° de tu capital",
      description: "Centraliza todas tus cuentas bancarias, tarjetas y billeteras digitales en un solo panel de control en tiempo real. Obtén una radiografía exacta de tu salud financiera al instante.",
      extra: "La categorización inteligente por IA organiza tus transacciones automáticamente, eliminando el trabajo manual y el caos de los extractos bancarios.",
      image: "/assets/images/facturacion.png"
    },
    {
      id: "presupuestos",
      label: "Presupuestos",
      icon: PiggyBank,
      title: "Planificación Financiera",
      description: "Establece límites de gasto dinámicos y objetivos de ahorro automatizados. Nuestro sistema proactivo te alerta antes de que te desvíes de tus metas mensuales.",
      features: [
        { icon: Bell, label: "Alertas de gasto en tiempo real" },
        { icon: TrendingUp, label: "Proyección de flujo de caja" },
        { icon: CheckCircle, label: "Metas de ahorro automáticas" }
      ],
      image: "/assets/images/pacientes.png"
    },
    {
      id: "inversiones",
      label: "Inversiones",
      icon: TrendingUp,
      title: "Maximización de Activos",
      description: "Monitorea el rendimiento de tu portafolio de acciones, criptomonedas y fondos indexados. Analiza tu diversificación y exposición al riesgo desde una interfaz unificada.",
      image: "/assets/images/multiplataforma.png"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      title: "Auditoría de Hábitos",
      description: "Desglosa tus patrones de consumo con gráficos interactivos de alto nivel. Identifica fugas de capital recurrentes y optimiza tu capacidad de ahorro mensual con datos precisos.",
      image: "/assets/images/citas.png"
    },
    {
      id: "seguridad",
      label: "Seguridad",
      icon: ShieldCheck,
      title: "Infraestructura Blindada",
      description: "Tus activos digitales y datos personales están protegidos con los estándares más exigentes de la industria financiera global.",
      integrations: [
        { name: "Cifrado AES-256", desc: "Seguridad de grado militar para todos tus datos." },
        { name: "Autenticación Biométrica", desc: "Soporte para FaceID y TouchID en móvil." },
        { name: "Zero-Knowledge", desc: "Solo tú tienes acceso a tu información financiera." }
      ],
      image: "/assets/images/multiplataforma.png"
    }
  ];

  // Datos de Precios (Copiados de Pricing.tsx)
  plans = [
    {
      name: "BÁSICO",
      priceMonthly: "15,00 $", priceYearly: "170,10€",
      description: "Infraestructura esencial para tomar el control de tu flujo de caja.",
      features: [
        "Sincronización de 2 cuentas bancarias",
        "Categorización automática por IA",
        "Dashboard de gastos en tiempo real",
        "Exportación de datos (CSV/PDF)"
      ],
      cta: "Muy pronto", disabled: true
    },
    {
      name: "INVESTOR",
      priceMonthly: "29,00 $", priceYearly: "261,00€",
      description: "Herramientas avanzadas para automatizar y optimizar tus inversiones.",
      features: [
        "Todo lo incluido en Starter",
        "Cuentas y tarjetas ilimitadas",
        "Tracking de portafolio en tiempo real",
        "Alertas de presupuesto inteligentes",
        "Análisis de patrimonio neto",
        "Soporte prioritario 24/7"
      ],
      cta: "Muy pronto", disabled: true, popular: true
    },
    {
      name: "WEALTH",
      priceMonthly: "49,00 $", priceYearly: "441,00€",
      description: "Potencia máxima para gestión patrimonial y empresarial.",
      features: [
        "Todo lo incluido en Investor",
        "Gestión multi-usuario y roles",
        "Conciliación bancaria avanzada",
        "API para integración contable",
        "Proyecciones de flujo de caja (5 años)",
        "Asesor financiero dedicado"
      ],
      cta: "Muy pronto", disabled: true
    }
  ];

  // Datos de Valores (Copiados de Values.tsx)
  values = [
    { icon: Shield, title: "Seguridad", desc: "Tus activos y datos personales están protegidos bajo los más estrictos estándares globales." },
    { icon: Rocket, title: "Automatización", desc: "Nuestro motor sincroniza y categoriza tus transacciones bancarias en tiempo real para que tú solo tomes decisiones." },
    { icon: Coins, title: "Rendimiento", desc: "Algoritmos predictivos que detectan oportunidades ocultas para maximizar el crecimiento de tu patrimonio mes a mes." }
  ];

  // --- ESTADO DEL LOGIN (Modal) ---
  // --- ESTADO DEL MODAL ---
  modalOpen = false;
  authMode: AuthMode = 'login';
  loading = false;
  isClosing = false;
  
  // Formularios Reactivos
  loginForm: FormGroup;
  emailControl: any; // Helpers para el HTML

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.emailControl = this.loginForm.get('email');
  }

  // --- MÉTODOS DE UI ---
  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }
  setActiveTab(id: string) { 
    this.activeTab = id;
  }
  getActiveFeature() { return this.featuresData.find(f => f.id === this.activeTab)!; }
  
  // Modal Methods
  openModal() { 
    this.modalOpen = true;
    this.isClosing = false;
    this.authMode = 'login'; // Reset to login on open
    document.body.style.overflow = 'hidden';
    
    // Animación de entrada con GSAP
    setTimeout(() => {
      const overlay = document.querySelector('.modal-overlay');
      const content = document.querySelector('.modal-content');
      
      if (overlay && content) {
        gsap.from(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        gsap.from(content, {
          scale: 0.7,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      }
    }, 0);
  }
  
  closeModal() {
    this.isClosing = true;
    const overlay = document.querySelector('.modal-overlay');
    const content = document.querySelector('.modal-content');
    
    if (overlay && content) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in'
      });
      
      gsap.to(content, {
        scale: 0.7,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          this.modalOpen = false;
          this.isClosing = false;
          document.body.style.overflow = 'auto';
        }
      });
    } else {
      // Fallback si no encuentra los elementos
      setTimeout(() => {
        this.modalOpen = false;
        this.isClosing = false;
        document.body.style.overflow = 'auto';
      }, 300);
    }
  }

  setAuthMode(mode: AuthMode) {
    this.authMode = mode;
  }

  // --- LÓGICA DE AUTH ---
  onSubmit() {
    if (this.authMode === 'login') {
      if (this.loginForm.invalid) return;
      this.loading = true;
      // Simulación de login
      setTimeout(() => {
        this.loading = false;
        this.closeModal();
        this.router.navigate(['/dashboard']);
      }, 1500);
    }
    // Aquí agregarías la lógica para 'register', 'verify', etc.
  }
}