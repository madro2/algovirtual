import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-two',
  templateUrl: './two.component.html',
  styleUrls: ['./two.component.css']
})
export class TwoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayerRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('sectionRef') sectionRef!: ElementRef<HTMLElement>;

  isMuted: boolean = true;
  isPlaying: boolean = false;
  private observer?: IntersectionObserver;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const video = this.videoPlayerRef?.nativeElement;
    const section = this.sectionRef?.nativeElement;

    if (video) {
      video.muted = true;
      this.isMuted = true;

      video.addEventListener('play', () => {
        this.isPlaying = true;
        this.cdr.detectChanges();
      });

      video.addEventListener('pause', () => {
        this.isPlaying = false;
        this.cdr.detectChanges();
      });

      video.addEventListener('volumechange', () => {
        this.isMuted = video.muted;
        this.cdr.detectChanges();
      });
    }

    if (section && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            this.playVideo();
          } else {
            this.pauseVideo();
          }
        });
      }, {
        threshold: [0, 0.25, 0.5, 0.75]
      });

      this.observer.observe(section);
    }
  }

  playVideo(): void {
    const video = this.videoPlayerRef?.nativeElement;
    if (video) {
      video.muted = this.isMuted;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.cdr.detectChanges();
          })
          .catch(() => {
            // Browsers allow autoplay when muted: ensure muted and retry if needed
            video.muted = true;
            this.isMuted = true;
            video.play().then(() => {
              this.isPlaying = true;
              this.cdr.detectChanges();
            }).catch(e => console.warn('Autoplay error:', e));
          });
      }
    }
  }

  pauseVideo(): void {
    const video = this.videoPlayerRef?.nativeElement;
    if (video && !video.paused) {
      video.pause();
      this.isPlaying = false;
      this.cdr.detectChanges();
    }
  }

  toggleMute(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const video = this.videoPlayerRef?.nativeElement;
    if (video) {
      this.isMuted = !this.isMuted;
      video.muted = this.isMuted;
      if (!this.isMuted && video.paused) {
        this.playVideo();
      }
      this.cdr.detectChanges();
    }
  }

  togglePlay(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const video = this.videoPlayerRef?.nativeElement;
    if (video) {
      if (video.paused) {
        this.playVideo();
      } else {
        this.pauseVideo();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
