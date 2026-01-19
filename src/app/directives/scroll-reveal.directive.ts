import { Directive, ElementRef, OnInit, OnDestroy, Input, numberAttribute } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input({ transform: numberAttribute }) delay: number = 0;
  @Input({ transform: numberAttribute }) duration: number = 0.8;
  @Input() direction: 'up' | 'down' | 'left' | 'right' | 'fade' = 'up';
  @Input({ transform: numberAttribute }) distance: number = 50;
  private scrollTrigger?: ScrollTrigger;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setupAnimation();
  }

  private setupAnimation() {
    const element = this.el.nativeElement;
    
    // Configuración inicial basada en la dirección
    const fromVars: gsap.TweenVars = {
      opacity: 0,
      duration: this.duration,
      delay: this.delay / 1000, // Convertir ms a segundos
    };

    switch (this.direction) {
      case 'up':
        fromVars.y = this.distance;
        break;
      case 'down':
        fromVars.y = -this.distance;
        break;
      case 'left':
        fromVars.x = this.distance;
        break;
      case 'right':
        fromVars.x = -this.distance;
        break;
      case 'fade':
        // Solo fade, sin movimiento
        break;
    }

    // Crear animación con ScrollTrigger
    const animation = gsap.fromTo(
      element,
      fromVars,
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: this.duration,
        delay: this.delay / 1000, // Convertir ms a segundos
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    this.scrollTrigger = animation.scrollTrigger as ScrollTrigger;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
  }
}